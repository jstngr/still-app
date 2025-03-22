import { useEffect, useState } from 'react';
import {
  AdMob,
  BannerAdSize,
  AdmobConsentStatus,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdPluginEvents,
  AdMobBannerSize,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { useThemeContext } from 'theme';

const AdMobBanner = () => {
  const { setFooterHeight } = useThemeContext();
  const [npa, setNpa] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        await AdMob.initialize();

        // Request App Tracking Transparency (iOS 14+)
        if (Capacitor.getPlatform() === 'ios') {
          await AdMob.requestTrackingAuthorization();
        }

        // Request Consent Info (GDPR for EU users)
        const { status } = await AdMob.requestConsentInfo();

        if (status === AdmobConsentStatus.REQUIRED) {
          await AdMob.showConsentForm();
        }

        // Determine if NPA is needed
        const updatedStatus = (await AdMob.requestConsentInfo()).status;
        if (updatedStatus === AdmobConsentStatus.NOT_REQUIRED) {
          setNpa(false); // Show personalized ads
        } else if (updatedStatus === AdmobConsentStatus.OBTAINED) {
          setNpa(false); // Personalized ads
        } else {
          setNpa(true); // Non-personalized ads
        }
      } catch (error) {
        console.error('AdMob initialization failed:', error);
      }

      // Add listener for banner size changes
      await AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
        setFooterHeight(size.height);
      });
    };

    initializeAdMob();
  }, []);

  useEffect(() => {
    if (npa !== null) {
      const showBannerAd = async () => {
        const options: BannerAdOptions = {
          adId: 'ca-app-pub-3385049365741222/3427416213', // Replace with your Ad Unit ID
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: false, // Set to true for testing
          npa: npa ?? undefined, // Apply NPA if required
        };

        await AdMob.showBanner(options);
      };

      showBannerAd();
    }
  }, [npa]);

  return null; // AdMob runs in the background, no UI element needed
};

export default AdMobBanner;
