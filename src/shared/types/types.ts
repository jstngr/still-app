type IFeedingType = 'Left' | 'Right' | 'Bottle';

interface IFeedingEntry {
  id?: number;
  created: number;
  stopped?: number;
  type: IFeedingType;
  pauseStart?: number;
  pauseDuration?: number;
  volume?: number;
}

interface IPoopEntry {
  id?: number;
  created: number;
}

interface IBoobDistribution {
  Left: number;
  Right: number;
}

export type { IFeedingType, IFeedingEntry, IPoopEntry, IBoobDistribution };
