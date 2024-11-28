import { Button } from '@mantine/core';
import { IconBabyBottle } from '@tabler/icons-react';
import React from 'react';
import { useFeedingContext } from 'service/feeding.service';
import { useSettingsContext } from 'service/settings.service';

export default function BottleButton() {
  const { addBottleFeedingEntry } = useFeedingContext();
  const { feedByBoob } = useSettingsContext();

  return (
    <Button
      styles={{
        root: {
          borderRadius: '50%',
          alignSelf: 'end',
        },
      }}
      color="primary"
      h={feedByBoob ? '4rem' : '6rem'}
      mah={feedByBoob ? '4rem' : '6rem'}
      maw={feedByBoob ? '4rem' : '6rem'}
      w={feedByBoob ? '4rem' : '6rem'}
      variant="outline"
      onClick={addBottleFeedingEntry}
    >
      <IconBabyBottle size={28} />
    </Button>
  );
}
