import { Text } from '@mantine/core';
import Timer from 'components/timer';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import formatSecondsToMinutesSeconds from 'shared/helpers/format-seconds-to-minutes-seconds';
import monoStyles from 'shared/styles/mono-styles.module.css';

interface DurationDisplayProps {
  isRunning: boolean;
  durationInSeconds: number;
}

export default function DurationDisplay({ isRunning, durationInSeconds }: DurationDisplayProps) {
  const { t } = useTranslation();

  return (
    <Timer isRunning={isRunning} isStopped={false} startingSeconds={Math.floor(durationInSeconds)}>
      {(timer) => (
        <Text size="sm">
          {timer.seconds < 60 && isRunning ? (
            t('history-card-label-just-started')
          ) : (
            <Trans
              i18nKey="history-card-label-duration"
              components={{
                Mono: <Text component="span" className={monoStyles.monoFont} />,
              }}
              values={{
                duration: formatSecondsToMinutesSeconds(Math.max(timer.seconds, 60)),
              }}
              count={Math.floor(Math.max(timer.seconds, 60) / 60)}
            />
          )}
        </Text>
      )}
    </Timer>
  );
}
