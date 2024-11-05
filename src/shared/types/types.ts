type IBoob = 'Left' | 'Right';

interface IFeedingEntry {
  id?: number;
  created: number;
  stopped?: number;
  boob: IBoob;
  pauseStart?: number;
  pauseDuration?: number;
}

interface IPoopEntry {
  id?: number;
  created: number;
}

interface IBoobDistribution {
  Left: number;
  Right: number;
}

export type { IBoob, IFeedingEntry, IPoopEntry, IBoobDistribution };
