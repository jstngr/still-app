import { Button } from '@mantine/core';
import { IconBabyBottle } from '@tabler/icons-react';
import React from 'react';
import { useFeedingContext } from 'service/feeding.service';

export default function BottleButton() {
  const { addBottleFeedingEntry } = useFeedingContext();

  return (
    <Button
      styles={{
        root: {
          borderRadius: '50%',
          alignSelf: 'end',
        },
      }}
      color="primary"
      h="4rem"
      mah="4rem"
      maw="4rem"
      w="4rem"
      variant="outline"
      onClick={addBottleFeedingEntry}
    >
      <IconBabyBottle size={28} />
    </Button>
  );
}
