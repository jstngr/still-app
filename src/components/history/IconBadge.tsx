import { Badge, BadgeVariant, Flex } from '@mantine/core';
import React from 'react';
import monoStyles from 'shared/styles/mono-styles.module.css';

interface IconBadgeProps {
  icon: React.ReactNode;
  variant?: BadgeVariant;
  color?: string;
}

export default function IconBadge({
  icon,
  variant = 'outline',
  color = 'primary',
}: IconBadgeProps) {
  return (
    <Badge w="2.5rem" variant={variant} color={color} size="lg" className={monoStyles.monoFont}>
      <Flex>{icon}</Flex>
    </Badge>
  );
}
