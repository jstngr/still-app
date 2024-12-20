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
import { useThemeContext } from 'theme';

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
  const [consentInfoStatus, setConsentStatusInfo] = useState(AdmobConsentStatus.UNKNOWN);
  const [trackingInfoStatus, setTrackingStatusInfo] = useState<ITrackingStatus>('notDetermined');

  const { initialized } = useSettingsContext();

  useEffect(() => {
    const init = async () => {
      const { consentInfo, trackingInfo } = await initializeAdmob();
      setConsentStatusInfo(consentInfo.status);
      setTrackingStatusInfo(trackingInfo.status);
    };
    init();
  }, []);

  const confirmAdmob = async () => {
    const [trackingInfo, consentInfo] = await Promise.all([
      AdMob.trackingAuthorizationStatus(),
      AdMob.requestConsentInfo(),
    ]);

    setConsentStatusInfo(consentInfo.status);
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

  const { setFooterHeight } = useThemeContext();

  useEffect(() => {
    if (initialized) {
      admobBanner(consentInfoStatus, trackingInfoStatus, (height: number) => {
        setFooterHeight(height + 66);
      });
    }
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

  AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
    // Subscribe Banner Event Listener
  });

  AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
    setFooterHeight(size.height);

    // Subscribe Change Banner Size
  });

  const options: BannerAdOptions = {
    adId: 'ca-app-pub-3940256099942544/2435281174',
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0, //Margin Banner. Default is 0px; If position is BOTTOM_CENTER, margin is be margin-bottom. If position is TOP_CENTER, margin is be margin-top.
    isTesting: true,
    npa: !isPersonalised, // The default behavior of the Google Mobile Ads SDK is to serve personalized ads. Set this to true to request Non-Personalized Ads
  };
  AdMob.showBanner(options);
}
