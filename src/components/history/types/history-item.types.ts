import { CSSProperties } from 'react';

export interface BaseEntry {
  id?: number;
  created: number;
}

export interface BaseHistoryItemProps<T extends BaseEntry> {
  index: number;
  style: CSSProperties;
  data: T[];
  showIcon?: boolean;
  icon?: React.ReactNode;
  onEdit?: (id: number) => void;
  isActive?: boolean;
  renderContent: (entry: T) => React.ReactNode;
  cardBaseSize?: number;
}

export interface BaseHistoryCardProps<T extends BaseEntry> {
  entry: T;
  showDateLabel: boolean;
  isActive?: boolean;
  icon?: React.ReactNode;
  onEdit?: (id: number) => void;
  children: React.ReactNode;
}
