import {
  AdMob,
  AdmobConsentStatus,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  AdMobBannerSize,
} from '@capacitor-community/admob';
import { TrackingAuthorizationStatusInterface } from '@capacitor-community/admob/dist/esm/shared/tracking-authorization-status.interface';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import React from 'react';
import { useSettingsContext } from './settings.service';
import { useThemeContext } from 'theme';

// Constants
const FOOTER_PADDING = 64;
const BANNER_AD_ID = {
  PROD: 'ca-app-pub-3385049365741222/3427416213',
  TEST: 'ca-app-pub-3940256099942544/2435281174',
};

// Debug logging function
const logAdMob = (message: string, data?: unknown) => {
  console.log(`[AdMob] 🙈 ${message}`, data ? data : '');
};

type ITrackingStatus = 'authorized' | 'denied' | 'notDetermined' | 'restricted';

async function initializeAdmob(): Promise<TrackingAuthorizationStatusInterface> {
  try {
    await AdMob.initialize();
    const [trackingInfo] = await Promise.all([AdMob.trackingAuthorizationStatus()]);

    return trackingInfo;
  } catch (error) {
    logAdMob('Failed to initialize AdMob:', error);
    throw error;
  }
}

interface IAdmobContextType {
  appleTrackingDenied: boolean;
  showConsentForms: () => Promise<void>;
}

const AdmobContext = createContext<IAdmobContextType | undefined>(undefined);

interface IAdmobProviderProps {
  children: ReactNode;
}

export const AdmobProvider: React.FC<IAdmobProviderProps> = ({ children }) => {
  const [trackingInfoStatus, setTrackingStatusInfo] = useState<ITrackingStatus>('notDetermined');
  const { initialized } = useSettingsContext();
  const [consentChecked, setConsentChecked] = useState(false);
  const [bannerDisplayed, setBannerDisplayed] = useState(false);
  const { setFooterHeight } = useThemeContext();

  useEffect(() => {
    const init = async () => {
      try {
        const trackingInfo = await initializeAdmob();
        setTrackingStatusInfo(trackingInfo.status);
      } catch (error) {
        logAdMob('Failed to initialize AdMob:', error);
      }
    };
    init();
  }, []);

  const getTrackingStatus = async () => {
    const trackingInfo = await AdMob.trackingAuthorizationStatus();
    setTrackingStatusInfo(trackingInfo.status);
    return trackingInfo.status;
  };

  const showConsentForms = async () => {
    try {
      let trackingStatus = await getTrackingStatus();

      // Show apple tracking consent form
      if (trackingStatus === 'notDetermined') {
        await AdMob.requestTrackingAuthorization();
        trackingStatus = await getTrackingStatus();
      }

      if (trackingStatus === 'authorized') {
        // get consent info
        const { isConsentFormAvailable, status: consentStatus } = await AdMob.requestConsentInfo();

        if (isConsentFormAvailable && consentStatus === AdmobConsentStatus.REQUIRED) {
          await AdMob.showConsentForm();
        }
      }
      setConsentChecked(true);
    } catch (error) {
      setConsentChecked(false);
      logAdMob('Failed to show consent forms:', error);
    }
  };

  const showBanner = async () => {
    try {
      const [trackingInfo, consentInfo] = await Promise.all([
        AdMob.trackingAuthorizationStatus(),
        AdMob.requestConsentInfo(),
      ]);

      await admobBanner(consentInfo.status, trackingInfo.status, (height: number) => {
        setFooterHeight(height + FOOTER_PADDING);
      });
      setBannerDisplayed(true);
    } catch (error) {
      setBannerDisplayed(false);
      logAdMob('Failed to show banner:', error);
    }
  };

  useEffect(() => {
    if (initialized && consentChecked && !bannerDisplayed) {
      showBanner();
    }
    if (initialized && !consentChecked && !bannerDisplayed) {
      showConsentForms();
    }
  }, [initialized, consentChecked, bannerDisplayed]);

  const contextValue: IAdmobContextType = {
    showConsentForms,
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
    logAdMob('Failed to show banner ad:', error);

    listenerHandle.remove();
    throw error;
  }
}
