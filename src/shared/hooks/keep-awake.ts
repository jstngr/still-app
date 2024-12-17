import { useEffect } from 'react';
import { KeepAwake } from '@capacitor-community/keep-awake';

export default function useKeepAwake() {
  useEffect(() => {
    async function keepAwake() {
      try {
        const result = await KeepAwake.isSupported();
        if (result.isSupported) {
          KeepAwake.keepAwake();
        }
      } catch (error) {
        console.error(error);
      }
    }
    keepAwake();
  }, []);
}
