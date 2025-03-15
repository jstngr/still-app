import { BadgeVariant } from '@mantine/core';
import { IconBabyBottle } from '@tabler/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IFeedingType } from 'shared/types/types';
import IconBadge from './IconBadge';

interface FeedingTypeBadgeProps {
  type: IFeedingType;
}

export default function FeedingTypeBadge({ type }: FeedingTypeBadgeProps) {
  const { t } = useTranslation();
  let content: string | React.ReactElement = '';
  const variant: BadgeVariant = type === 'Bottle' ? 'outline' : 'filled';
  const color = type === 'Left' ? 'blue' : 'primary';

  if (type === 'Bottle') {
    content = <IconBabyBottle size={14} stroke={2} />;
  } else {
    content = t(type === 'Left' ? 'upperletter-left' : 'upperletter-right');
  }

  return <IconBadge icon={content} variant={variant} color={color} />;
}
