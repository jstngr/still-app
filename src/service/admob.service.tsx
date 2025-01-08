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
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import React from 'react';
import { useSettingsContext } from './settings.service';

type ITrackingStatus = 'authorized' | 'denied' | 'notDetermined' | 'restricted';

async function initializeAdmob(): Promise<{
  consentInfo: AdmobConsentInfo;
  trackingInfo: TrackingAuthorizationStatusInterface;
}> {
  await AdMob.initialize();

  const [trackingInfo, consentInfo] = await Promise.all([
    AdMob.trackingAuthorizationStatus(),
    AdMob.requestConsentInfo(),
  ]);

  return {
    consentInfo,
    trackingInfo,
  };
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

  useEffect(() => {
    const init = async () => {
      const { trackingInfo } = await initializeAdmob();
      setTrackingStatusInfo(trackingInfo.status);
    };
    init();
  }, []);

  const confirmAdmob = async () => {
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
  };

  // const { setFooterHeight } = useThemeContext();

  const showBanner = async () => {
    if (!initialized) {
      return;
    }

    const [trackingInfo, consentInfo] = await Promise.all([
      AdMob.trackingAuthorizationStatus(),
      AdMob.requestConsentInfo(),
    ]);

    // Make sure permission was asked
    if (
      trackingInfo.status === 'notDetermined' ||
      consentInfo.status === AdmobConsentStatus.REQUIRED
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

      setTimeout(() => {
        // try again after 1 minute
        showBanner();
      }, 60 * 1000);
      return;
    }

    // admobBanner(consentInfo.status, trackingInfo.status, (height: number) => {
    //   setFooterHeight(height + 64);
    // });
  };

  useEffect(() => {
    showBanner();
  }, [initialized]);

  return (
    <AdmobContext.Provider
      value={{ confirmAdmob, appleTrackingDenied: trackingInfoStatus === 'denied' }}
    >
      {children}
    </AdmobContext.Provider>
  );
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

  AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
    setFooterHeight(size.height);
  });

  const options: BannerAdOptions = {
    // adId: 'ca-app-pub-3940256099942544/2435281174', // Test
    adId: 'ca-app-pub-3385049365741222/3427416213', // Prod
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: true,
    npa: !isPersonalised, // The default behavior of the Google Mobile Ads SDK is to serve personalized ads. Set this to true to request Non-Personalized Ads
  };
  AdMob.showBanner(options);
}
