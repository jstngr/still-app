import { Button, ButtonVariant, MantineColor, MantineStyleProp, Stack, Text } from '@mantine/core';
import React from 'react';
import { IconPlayerPause, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';

interface IBoobButtonProps {
  color: MantineColor;
  label: String;
  orientation: 'left' | 'right';
  active?: boolean;
  variant?: ButtonVariant;
}

export default function BoobButton(props: IBoobButtonProps) {
  const { color, label, active, variant = 'default' } = props;

  const rootStyle: MantineStyleProp = {
    borderRadius: '50%',
  };

  if (active) {
    return (
      <Stack gap="xxs">
        <Button
          styles={{
            root: {
              borderTopLeftRadius: '99999px',
              borderTopRightRadius: '99999px',
            },
          }}
          color={color}
          h="calc(4rem - (var(--mantine-spacing-xxs) * 0.5))"
          mah="calc(15vw - (var(--mantine-spacing-xxs) * 0.5))"
          w="30vw"
          maw="8rem"
          variant={variant}
        >
          <Stack gap="0" align="center">
            <IconPlayerPause />
            <Text size="xs">Pause</Text>
          </Stack>
        </Button>
        <Button
          styles={{
            root: {
              borderBottomLeftRadius: '99999px',
              borderBottomRightRadius: '99999px',
            },
          }}
          color={color}
          h="calc(4rem - (var(--mantine-spacing-xxs) * 0.5))"
          mah="calc(15vw - (var(--mantine-spacing-xxs) * 0.5))"
          w="30vw"
          maw="8rem"
        >
          <Stack gap="0" align="center">
            <IconPlayerStop />
            <Text size="xs">Stop</Text>
          </Stack>
        </Button>
      </Stack>
    );
  }

  return (
    <Button
      styles={{
        root: {
          borderRadius: '50%',
        },
      }}
      color={color}
      h="30vw"
      mah="8rem"
      w="30vw"
      maw="8rem"
    >
      <Stack gap="xxs" align="center">
        <IconPlayerPlay />
        <Text>{label}</Text>
      </Stack>
    </Button>
  );
}
