import { Button, Stack, Text } from '@mantine/core';
import { IconPlayerPause, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import React, { useMemo } from 'react';
import { useFeedingContext } from 'service/feeding.service';
import { IBoob } from 'shared/types/types';
import styles from './boob-button.module.css';
import { DefaultTFuncReturn } from 'i18next';
import { useTranslation } from 'react-i18next';
interface IBoobButtonProps {
  label: DefaultTFuncReturn;
  orientation: IBoob;
}

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
    [props.orientation, feedingEntries, activeFeeding]
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
          h="calc(4rem - (var(--mantine-spacing-xxs) * 0.5))"
          mah="calc(15vw - (var(--mantine-spacing-xxs) * 0.5))"
          w="30vw"
          maw="8rem"
          variant={'outline'}
          onClick={isPause ? continueFeeding : pauseFeeding}
        >
          {isPause ? (
            <Stack gap="0" align="center">
              <IconPlayerPlay />
              <Text size="xs">{t('boob-button-label-continue')}</Text>
            </Stack>
          ) : (
            <Stack gap="0" align="center">
              <IconPlayerPause />
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
          color={'primary'}
          h="calc(4rem - (var(--mantine-spacing-xxs) * 0.5))"
          mah="calc(15vw - (var(--mantine-spacing-xxs) * 0.5))"
          w="30vw"
          maw="8rem"
          onClick={stopFeeding}
        >
          <Stack gap="0" align="center">
            <IconPlayerStop />
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
        },
      }}
      color={'primary'}
      h="30vw"
      mah="8rem"
      w="30vw"
      maw="8rem"
      onClick={() => startFeeding(props.orientation)}
    >
      {markAsNext && <div className={styles.boobButtonIndicator} />}
      <Stack gap="xxs" align="center">
        <IconPlayerPlay />
        <Text>{label}</Text>
      </Stack>
    </Button>
  );
}
