import { Badge, BadgeVariant, Flex } from '@mantine/core';
import { IconBabyBottle } from '@tabler/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import monoStyles from 'shared/styles/mono-styles.module.css';
import { IFeedingType } from 'shared/types/types';

interface FeedingTypeBadgeProps {
  type: IFeedingType;
}

export default function FeedingTypeBadge({ type }: FeedingTypeBadgeProps) {
  const { t } = useTranslation();
  let content: string | React.ReactElement = '';
  let variant: BadgeVariant = 'filled';

  if (type === 'Bottle') {
    content = (
      <Flex>
        <IconBabyBottle size={14} stroke={2} />
      </Flex>
    );
    variant = 'outline';
  }
  if (type === 'Left') content = t('upperletter-left');
  if (type === 'Right') content = t('upperletter-right');

  return (
    <Badge
      w="2.5rem"
      variant={variant}
      color={type === 'Left' ? 'blue' : 'primary'}
      size="lg"
      className={monoStyles.monoFont}
    >
      {content}
    </Badge>
  );
}
