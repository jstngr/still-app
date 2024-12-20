import { Button, Stack, Text } from '@mantine/core';
import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Icon, IconProps } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

interface INavButtonProps {
  active?: boolean;
  label: string;
  Icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  to: string;
}

export default function NavButton(props: INavButtonProps) {
  const { Icon, label, active, to } = props;

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(to);
  };

  const strokeWidth = active ? '2' : '1.5';
  const fontWidth = active ? '700' : '500';
  const color = active ? 'primary' : 'primary.2';

  return (
    <Button onClick={handleNavigate} variant="transparent" h="auto" pt="xs" color={color} px={0}>
      <Stack gap="xxs" align="center">
        <Icon size="20px" strokeWidth={strokeWidth} />
        <Text fw={fontWidth} size="xs">
          {label}
        </Text>
      </Stack>
    </Button>
  );
}
