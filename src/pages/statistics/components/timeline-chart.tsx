import { InputLabel, ScrollArea, Stack } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import roundTo30Minutes from 'shared/helpers/rount-to-30-minutes';
import monoStyles from 'shared/styles/mono-styles.module.css';
import { IFeedingEntry } from 'shared/types/types';
import Styles from './timeline-chart.module.css';

interface ITimlineChartProps {
  chunks: IFeedingEntry[][];
}

const HOUR = 60 * 60 * 1000;

const chartHeight = 110;

export default function TimelineChart(props: ITimlineChartProps) {
  const { chunks } = props;
  const { t } = useTranslation();

  const startingDate = roundTo30Minutes(Date.now() - 24 * HOUR, 'last');
  const endDate = roundTo30Minutes(Date.now() + HOUR, 'next');
  const totalWidth = endDate - startingDate;

  const startHours = new Date(startingDate).getHours();
  const hours = Array.from({ length: 26 }, (_, index) => (startHours + index) % 24);

  const getBarWidth = (entry: IFeedingEntry) => {
    const { created, stopped = created } = entry;
    const length = Math.max(0, stopped - created);
    return (100 * length) / totalWidth;
  };
  const getBarX = (created: number) => {
    const startToCreatedDist = created - startingDate;
    return (100 * startToCreatedDist) / totalWidth;
  };
  const getChunkLabelX = (entry: IFeedingEntry) => {
    const { created, stopped = created } = entry;
    const middleLenght = Math.max(0, stopped - created) / 2;
    const startToMiddleDist = created + middleLenght - startingDate;
    return (100 * startToMiddleDist) / totalWidth;
  };
  const getGridLineX = (index: number) => {
    const roundedStartingHour = new Date(startingDate);
    roundedStartingHour.setMinutes(0, 0, 0); // Round down to the nearest hour
    const roundedStamp = roundedStartingHour.getTime();
    const newTimeStamp = roundedStamp + index * HOUR;
    const startToNewDist = newTimeStamp - startingDate;

    return (100 * startToNewDist) / totalWidth;
  };

  return (
    <Stack gap="xs">
      <InputLabel>{t('timeline-chart-label')}</InputLabel>
      <ScrollArea>
        <svg className={Styles.chart} width="1000px" height={chartHeight} role="img">
          {hours.map((h, index) => (
            <g key={`hours_${index}`}>
              <line
                x1={`${getGridLineX(index)}%`}
                y1="15"
                x2={`${getGridLineX(index)}%`}
                y2="90"
                stroke="var(--mantine-color-gray-4)"
                strokeWidth="1"
              />
              {index !== hours.length - 1 && (
                <line
                  x1={`${getGridLineX(index + 0.5)}%`}
                  y1="15"
                  x2={`${getGridLineX(index + 0.5)}%`}
                  y2="100"
                  stroke="var(--mantine-color-gray-2)"
                  strokeWidth="1"
                  key={`line_${index}`}
                />
              )}
              {index !== 0 && (
                <text
                  x={`${getGridLineX(index)}%`}
                  y="100"
                  className={`${monoStyles.monoFont} ${Styles.label}`}
                  key={`text_${index}`}
                >
                  {h}:00
                </text>
              )}
            </g>
          ))}
          {chunks.map((chunkEntries, chunkIndex) => {
            const chunkStart = chunkEntries[0]?.created;
            const chunkEnd = chunkEntries[chunkEntries.length - 1]?.stopped;
            const fakeEntry: IFeedingEntry = {
              created: chunkStart,
              stopped: chunkEnd,
              boob: 'Left',
            };
            return (
              <>
                <rect
                  className={Styles.chunkBar}
                  x={`${getBarX(chunkStart)}%`}
                  y="23"
                  width={`${getBarWidth(fakeEntry)}%`}
                  height="7"
                  rx="2px"
                  key={`chunk_${chunkIndex}`}
                />
                <text
                  x={`${getChunkLabelX(fakeEntry)}%`}
                  y="13"
                  className={`${monoStyles.monoFont} ${Styles.chunkLabel}`}
                  key={`text_chunk_${chunkIndex}`}
                >
                  {chunkIndex + 1}
                </text>
                {chunkEntries.map((entry) => (
                  <g key={`rect_${entry.id}`}>
                    <rect
                      className={Styles.bar}
                      x={`${getBarX(entry.created)}%`}
                      y="33"
                      width={`${getBarWidth(entry)}%`}
                      height="49px"
                      rx="2px"
                    />
                  </g>
                ))}
              </>
            );
          })}
        </svg>
      </ScrollArea>
    </Stack>
  );
}
