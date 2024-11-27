import { Button } from '@mantine/core';
import { IconBabyBottle } from '@tabler/icons-react';
import React from 'react';

export default function BottleButton() {
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
      onClick={() => {}}
    >
      <IconBabyBottle size={28} />
    </Button>
  );
}
