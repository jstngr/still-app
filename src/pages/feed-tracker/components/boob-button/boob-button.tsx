import { Button, Stack, Text } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import React, { useMemo } from 'react';
import { useFeedingContext } from 'service/feeding.service';
import { IFeedingType } from 'shared/types/types';
import styles from './boob-button.module.css';
import { DefaultTReturn } from 'i18next';
import { useTranslation } from 'react-i18next';
import { $Dictionary } from 'i18next/typescript/helpers';
import { useAppRatingContext } from 'service/app-rating.service';
interface IBoobButtonProps {
  label: DefaultTReturn<$Dictionary>;
  orientation: IFeedingType;
}

const height = '30vw';
const maxHeight = '6rem';

export default function BoobButton(props: IBoobButtonProps) {
  const { t } = useTranslation();
  const { label, orientation } = props;
  const { startFeeding, feedingEntries, activeFeeding, stopFeeding } = useFeedingContext();

  const isActive = useMemo(() => activeFeeding?.type === props.orientation, [activeFeeding]);

  const markAsNext = useMemo(
    () =>
      !activeFeeding &&
      !!feedingEntries?.length &&
      feedingEntries[0]?.type !== props.orientation &&
      feedingEntries[0]?.type !== 'Bottle',
    [props.orientation, feedingEntries, activeFeeding],
  );

  const isLeft = orientation === 'Left';

  const { triggerRating } = useAppRatingContext();

  const onClick = () => {
    if (isActive) {
      stopFeeding();
    } else {
      startFeeding(props.orientation);
    }
    triggerRating();
  };

  return (
    <Button
      styles={{
        root: {
          borderRadius: '50%',
          overflow: 'visible',
        },
      }}
      color={isLeft ? 'blue' : 'primary'}
      h={height}
      mah={maxHeight}
      w={height}
      maw={maxHeight}
      onClick={onClick}
    >
      {markAsNext && (
        <div className={styles.nextButtonIndicator}>
          <Text>{t('boob-button-label-next')}</Text>
        </div>
      )}
      <Stack gap="xxs" align="center">
        {isActive ? <IconPlayerStop size={32} /> : <IconPlayerPlay size={20} />}
        {!isActive && <Text size="md">{label}</Text>}
      </Stack>
    </Button>
  );
}
