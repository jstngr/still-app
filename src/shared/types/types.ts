type IFeedingType = 'Left' | 'Right' | 'Bottle';

export interface IFeedingEntry {
  id: number;
  type: IFeedingType;
  started: number;
  stopped?: number;
  volume?: number;
}

interface IPoopEntry {
  id: number;
  created: number;
}

interface ISleepEntry {
  id: number;
  created: number;
  stopped?: number;
}

interface IBoobDistribution {
  Left: number;
  Right: number;
  LeftFeedings: IFeedingEntry[];
  RightFeedings: IFeedingEntry[];
}

export type { ISleepEntry, IFeedingType, IPoopEntry, IBoobDistribution };
