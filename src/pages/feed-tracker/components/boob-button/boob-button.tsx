import { Button, Stack, Text } from '@mantine/core';
import { IconPlayerPause, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import React, { useMemo } from 'react';
import { useFeedingContext } from 'service/feeding.service';
import { IBoob } from 'shared/types/types';
import styles from './boob-button.module.css';
import { DefaultTReturn } from 'i18next';
import { useTranslation } from 'react-i18next';
import { $Dictionary } from 'i18next/typescript/helpers';
interface IBoobButtonProps {
  label: DefaultTReturn<$Dictionary>;
  orientation: IBoob;
}

const height = '30vw';
const maxHeight = '6rem';

export default function BoobButton(props: IBoobButtonProps) {
  const { t } = useTranslation();
  const { label } = props;
  const {
    startFeeding,
    feedingEntries,
    activeFeeding,
    stopFeeding,
    pauseFeeding,
    continueFeeding,
  } = useFeedingContext();

  const isActive = useMemo(() => activeFeeding?.boob === props.orientation, [activeFeeding]);
  const isPause = useMemo(() => isActive && activeFeeding?.pauseStart, [activeFeeding, isActive]);

  const markAsNext = useMemo(
    () =>
      !activeFeeding && !!feedingEntries?.length && feedingEntries[0]?.boob !== props.orientation,
    [props.orientation, feedingEntries, activeFeeding],
  );

  if (isActive) {
    return (
      <Stack gap="xxs">
        <Button
          styles={{
            root: {
              borderTopLeftRadius: '99999px',
              borderTopRightRadius: '99999px',
            },
          }}
          color="primary"
          h={`calc(${height} / 2 - (var(--mantine-spacing-xxs) * 0.5))`}
          mah={`calc(${maxHeight} / 2 - (var(--mantine-spacing-xxs) * 0.5))`}
          w={height}
          maw={maxHeight}
          variant="outline"
          onClick={isPause ? continueFeeding : pauseFeeding}
        >
          {isPause ? (
            <Stack gap="0" align="center">
              <IconPlayerPlay size={20} />
              <Text size="xs">{t('boob-button-label-continue')}</Text>
            </Stack>
          ) : (
            <Stack gap="0" align="center">
              <IconPlayerPause size={20} />
              <Text size="xs">{t('boob-button-label-pause')}</Text>
            </Stack>
          )}
        </Button>
        <Button
          styles={{
            root: {
              borderBottomLeftRadius: '99999px',
              borderBottomRightRadius: '99999px',
            },
          }}
          color="primary"
          h={`calc(${height} / 2 - (var(--mantine-spacing-xxs) * 0.5))`}
          mah={`calc(${maxHeight} / 2 - (var(--mantine-spacing-xxs) * 0.5))`}
          w={height}
          maw={maxHeight}
          onClick={stopFeeding}
        >
          <Stack gap="0" align="center">
            <IconPlayerStop size={20} />
            <Text size="xs">{t('boob-button-label-stop')}</Text>
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
          overflow: 'visible',
        },
      }}
      color="primary"
      h={height}
      mah={maxHeight}
      w={height}
      maw={maxHeight}
      onClick={() => startFeeding(props.orientation)}
    >
      {markAsNext && (
        <div className={styles.nextButtonIndicator}>
          <Text>{t('boob-button-label-next')}</Text>
        </div>
      )}
      <Stack gap="xxs" align="center">
        <IconPlayerPlay size={20} />
        <Text size="md">{label}</Text>
      </Stack>
    </Button>
  );
}
