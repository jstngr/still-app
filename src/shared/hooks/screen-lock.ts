import { useEffect } from 'react';
import { ScreenOrientation } from '@capacitor/screen-orientation';

export default function useScreenLock() {
  useEffect(() => {
    // Lock the orientation to portrait
    ScreenOrientation.lock({ orientation: 'portrait' });

    // Optionally unlock on component unmount
    return () => {
      ScreenOrientation.unlock();
    };
  }, []);
}
