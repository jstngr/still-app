import {
  AdMob,
  AdmobConsentInfo,
  AdmobConsentStatus,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  AdMobBannerSize,
} from '@capacitor-community/admob';
import { TrackingAuthorizationStatusInterface } from '@capacitor-community/admob/dist/esm/shared/tracking-authorization-status.interface';
import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from 'react';
import React from 'react';
import { useSettingsContext } from './settings.service';
import { useThemeContext } from 'theme';

// Constants
const RETRY_DELAY_MS = 60 * 1000;
const FOOTER_PADDING = 64;
const BANNER_AD_ID = {
  PROD: 'ca-app-pub-3385049365741222/3427416213',
  TEST: 'ca-app-pub-3940256099942544/2435281174',
};

type ITrackingStatus = 'authorized' | 'denied' | 'notDetermined' | 'restricted';

async function initializeAdmob(): Promise<{
  consentInfo: AdmobConsentInfo;
  trackingInfo: TrackingAuthorizationStatusInterface;
}> {
  try {
    await AdMob.initialize();

    const [trackingInfo, consentInfo] = await Promise.all([
      AdMob.trackingAuthorizationStatus(),
      AdMob.requestConsentInfo(),
    ]);

    return {
      consentInfo,
      trackingInfo,
    };
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
    throw error;
  }
}

interface IAdmobContextType {
  appleTrackingDenied: boolean;
  confirmAdmob: () => Promise<void>;
}

const AdmobContext = createContext<IAdmobContextType | undefined>(undefined);

interface IAdmobProviderProps {
  children: ReactNode;
}

export const AdmobProvider: React.FC<IAdmobProviderProps> = ({ children }) => {
  const [trackingInfoStatus, setTrackingStatusInfo] = useState<ITrackingStatus>('notDetermined');
  const { initialized } = useSettingsContext();
  const { setFooterHeight } = useThemeContext();

  useEffect(() => {
    const init = async () => {
      try {
        const { trackingInfo } = await initializeAdmob();
        setTrackingStatusInfo(trackingInfo.status);
      } catch (error) {
        console.error('Failed to initialize AdMob provider:', error);
      }
    };
    init();
  }, []);

  const confirmAdmob = async () => {
    try {
      const [trackingInfo, consentInfo] = await Promise.all([
        AdMob.trackingAuthorizationStatus(),
        AdMob.requestConsentInfo(),
      ]);

      setTrackingStatusInfo(trackingInfo.status);

      if (trackingInfo.status === 'notDetermined') {
        await AdMob.requestTrackingAuthorization();
      }

      const authorizationStatus = await AdMob.trackingAuthorizationStatus();
      setTrackingStatusInfo(authorizationStatus.status);

      if (
        authorizationStatus.status === 'authorized' &&
        consentInfo.isConsentFormAvailable &&
        consentInfo.status === AdmobConsentStatus.REQUIRED
      ) {
        await AdMob.showConsentForm();
      }
    } catch (error) {
      console.error('Failed to confirm AdMob:', error);
      throw error;
    }
  };

  const showBanner = useCallback(async () => {
    if (!initialized) {
      return;
    }

    try {
      const [trackingInfo, consentInfo] = await Promise.all([
        AdMob.trackingAuthorizationStatus(),
        AdMob.requestConsentInfo(),
      ]);

      // Make sure permission was asked
      if (
        (trackingInfo.status === 'notDetermined' ||
          consentInfo.status === AdmobConsentStatus.REQUIRED) &&
        trackingInfo.status !== 'denied'
      ) {
        if (trackingInfo.status === 'notDetermined') {
          await AdMob.requestTrackingAuthorization();
        }

        const authorizationStatus = await AdMob.trackingAuthorizationStatus();
        setTrackingStatusInfo(authorizationStatus.status);

        if (
          authorizationStatus.status === 'authorized' &&
          consentInfo.isConsentFormAvailable &&
          consentInfo.status === AdmobConsentStatus.REQUIRED
        ) {
          await AdMob.showConsentForm();
        }

        // Retry after delay
        setTimeout(() => {
          showBanner();
        }, RETRY_DELAY_MS);
        return;
      }

      await admobBanner(consentInfo.status, trackingInfo.status, (height: number) => {
        setFooterHeight(height + FOOTER_PADDING);
      });
    } catch (error) {
      console.error('Failed to show banner:', error);
    }
  }, [initialized, setFooterHeight]);

  useEffect(() => {
    showBanner();
  }, [initialized, showBanner]);

  const contextValue: IAdmobContextType = {
    confirmAdmob,
    appleTrackingDenied: trackingInfoStatus === 'denied',
  };

  return <AdmobContext.Provider value={contextValue}>{children}</AdmobContext.Provider>;
};

export const useAdmobContext = () => {
  const context = useContext(AdmobContext);
  if (context === undefined) {
    throw new Error('useAdmobContext must be used within a AdmobContext');
  }
  return context;
};

export async function admobBanner(
  consentInfoStatus: AdmobConsentStatus,
  trackingInfoStatus: ITrackingStatus,
  setFooterHeight: (height: number) => void,
): Promise<void> {
  const isPersonalised =
    consentInfoStatus === AdmobConsentStatus.OBTAINED && trackingInfoStatus === 'authorized';

  // Add listener for banner size changes
  const listenerHandle = await AdMob.addListener(
    BannerAdPluginEvents.SizeChanged,
    (size: AdMobBannerSize) => {
      setFooterHeight(size.height);
    },
  );

  const options: BannerAdOptions = {
    adId: BANNER_AD_ID.PROD,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: false,
    npa: !isPersonalised,
  };

  try {
    await AdMob.showBanner(options);
  } catch (error) {
    // Clean up listener if showing banner fails
    listenerHandle.remove();
    console.error('Failed to show banner ad:', error);
    throw error;
  }
}
