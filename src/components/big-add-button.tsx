import { Button, Stack, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React from 'react';

interface IBigAddButtonProps {
  onClick: () => void;
  label: string;
}

export default function BigAddButton(props: IBigAddButtonProps) {
  const { label } = props;

  return (
    <Button
      styles={{
        root: {
          borderRadius: '50%',
        },
      }}
      color={'primary'}
      h="30vw"
      mah="8rem"
      w="30vw"
      maw="8rem"
      onClick={props.onClick}
    >
      <Stack gap="xxs" align="center">
        <IconPlus />
        <Text>{label}</Text>
      </Stack>
    </Button>
  );
}
