import { Device } from '@capacitor/device';

export default async function getSystemLanguage() {
  try {
    const info = await Device.getLanguageCode();
    return info?.value || 'en';
  } catch (error) {
    return navigator.language || 'en';
  }
}
