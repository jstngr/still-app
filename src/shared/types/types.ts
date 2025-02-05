type IFeedingType = 'Left' | 'Right' | 'Bottle';

interface IFeedingEntry {
  id?: number;
  created: number;
  stopped?: number;
  type: IFeedingType;
  volume?: number;
}

interface IPoopEntry {
  id?: number;
  created: number;
}

interface ISleepEntry {
  id?: number;
  created: number;
  stopped: number;
}

interface IBoobDistribution {
  Left: number;
  Right: number;
  LeftFeedings: IFeedingEntry[];
  RightFeedings: IFeedingEntry[];
}

export type { ISleepEntry, IFeedingType, IFeedingEntry, IPoopEntry, IBoobDistribution };
