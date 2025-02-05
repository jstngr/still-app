import { Flex, Text } from '@mantine/core';
import FeedingEntry from 'classes/feeding-entry.class';
import React, { useMemo } from 'react';
import { useFeedingContext } from 'service/feeding.service';

import formatTime from 'shared/helpers/format-time';
import monoStyles from 'shared/styles/mono-styles.module.css';
import Timer from '../../../components/timer';
import { useTranslation } from 'react-i18next';

export default function TimeAgoTimer() {
  const { feedingEntries } = useFeedingContext();
  const lastEntry = feedingEntries[0];
  const { t } = useTranslation();

  const timeAgo = useMemo(() => {
    if (!lastEntry) return 0;
    return new FeedingEntry(lastEntry).getTimeAgo();
  }, [lastEntry]);

  if (timeAgo > 1000 * 60 * 60 * 24) {
    return (
      <Flex h="42px" align="center" direction="column">
        <Text size="sm" c="dimmed" maw={200} ta="center">
          {t('time-ago-label-more-than-24-hours')}
        </Text>
      </Flex>
    );
  }
  return (
    <Flex h="42px" align="center" direction="column" gap="xxs">
      <Text size="sm" c="dimmed">
        {t('time-ago-label')}
      </Text>
      <Text size="20px" className={monoStyles.monoFont}>
        <Timer
          isRunning={true}
          isStopped={false}
          startingSeconds={Math.floor(timeAgo / 1000)}
          timerId={lastEntry?.id}
        >
          {(timer) => <>{formatTime(timer.seconds)}</>}
        </Timer>
      </Text>
    </Flex>
  );
}
