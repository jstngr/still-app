import { useEffect, useState } from 'react';

import { Capacitor } from '@capacitor/core';

import { Preferences } from '@capacitor/preferences';

export default function useDatabase() {
  const [data, setData] = useState(0);

  const [isDbReady, setDbReady] = useState(false);

  const write = async (value) => {
    await Preferences.set({
      key: 'data',
      value,
    });
  };
  const read = async () => {
    const ret = await Preferences.get({ key: 'data' });
    const result = JSON.parse(ret.value || '0');
    setData(result);
  };

  useEffect(() => {
    write(data);
  }, [data]);

  useEffect(() => {
    read();
  }, []);

  return {
    data,
    write: (value) => setData(value),
    isDbReady,
  };
}
