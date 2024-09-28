type IBoob = 'Left' | 'Right';

interface IFeedingEntry {
  id: number;
  created: number;
  stopped?: number;
  boob: IBoob;
  pauseStart?: number;
  pauseDuration?: number;
}

export type { IBoob, IFeedingEntry };
