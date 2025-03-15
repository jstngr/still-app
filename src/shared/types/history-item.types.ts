import { IFeedingEntry, ISleepEntry } from './types';

export interface BaseHistoryItemProps<T> {
  index: number;
  style: React.CSSProperties;
  data: T[];
}

export type FeedingHistoryItemProps = BaseHistoryItemProps<IFeedingEntry>;
export type SleepHistoryItemProps = BaseHistoryItemProps<ISleepEntry>;
