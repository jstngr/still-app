import { AdMob, AdmobConsentStatus } from '@capacitor-community/admob';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import React from 'react';

type ITrackingStatus = 'authorized' | 'denied' | 'notDetermined' | 'restricted';

export async function initializeAdmob(): Promise<void> {
  await AdMob.initialize();

  const [trackingInfo, consentInfo] = await Promise.all([
    AdMob.trackingAuthorizationStatus(),
    AdMob.requestConsentInfo(),
  ]);

  console.log('🚀 ~ initializeAdmob ~ consentInfo:', consentInfo);
  console.log('🚀 ~ initializeAdmob ~ trackingInfo:', trackingInfo);

  if (trackingInfo.status === 'notDetermined') {
    /**
     * If you want to explain TrackingAuthorization before showing the iOS dialog,
     * you can show the modal here.
     * ex)
     * const modal = await this.modalCtrl.create({
     *   component: RequestTrackingPage,
     * });
     * await modal.present();
     * await modal.onDidDismiss();  // Wait for close modal
     **/

    await AdMob.requestTrackingAuthorization();
  }

  const authorizationStatus = await AdMob.trackingAuthorizationStatus();
  if (
    authorizationStatus.status === 'authorized' &&
    consentInfo.isConsentFormAvailable &&
    consentInfo.status === AdmobConsentStatus.REQUIRED
  ) {
    await AdMob.showConsentForm();
  }
  console.log('🚀 ~ initializeAdmob ~ authorizationStatus.status:', authorizationStatus.status);
  console.log('🚀 ~ initializeAdmob ~ consentInfo.status:', consentInfo.status);
}

interface IAdmobContextType {
  personalTracking: boolean;
}

const AdmobContext = createContext<IAdmobContextType | undefined>(undefined);

interface IAdmobProviderProps {
  children: ReactNode;
}

export const AdmobProvider: React.FC<IAdmobProviderProps> = ({ children }) => {
  const [consentInfoStatus, setConsentStatusInfo] = useState(AdmobConsentStatus.UNKNOWN);
  const [trackingInfoStatus, setTrackingStatusInfo] = useState<ITrackingStatus>('notDetermined');

  useEffect(() => {
    initializeAdmob();
  }, []);

  const personalTracking =
    consentInfoStatus === AdmobConsentStatus.OBTAINED && trackingInfoStatus === 'authorized';

  return <AdmobContext.Provider value={{ personalTracking }}>{children}</AdmobContext.Provider>;
};

export const useAdmobContext = () => {
  const context = useContext(AdmobContext);
  if (context === undefined) {
    throw new Error('useAdmobContext must be used within a AdmobContext');
  }
  return context;
};
