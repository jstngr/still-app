import { IFeedingType, IFeedingEntry } from 'shared/types/types';

export default class FeedingEntry {
  private id: number | undefined;
  private created: number = 0;
  private stopped: number = 0;
  private type: IFeedingType = 'Left';
  private volume: number = 0;

  constructor(feedingObject: Pick<IFeedingEntry, 'type'> & Partial<IFeedingEntry>) {
    this.id = feedingObject.id || undefined;
    this.created = feedingObject.created || new Date().getTime();
    this.stopped = feedingObject.stopped || 0;
    this.type = feedingObject.type;
    this.volume = feedingObject.volume || 0;
  }

  stop(): void {
    this.stopped = new Date().getTime();
  }

  getDuration(): number {
    return (this.stopped || new Date().getTime()) - this.created;
  }

  toObject(): IFeedingEntry {
    return {
      id: this.id,
      created: this.created,
      stopped: this.stopped,
      type: this.type,
      volume: this.volume,
    };
  }

  isRunning(): boolean {
    return !this.stopped;
  }

  getId() {
    return this.id;
  }

  getTimeAgo() {
    return new Date().getTime() - this.stopped;
  }

  getStarted() {
    return this.created;
  }

  getStopped() {
    return this.stopped;
  }

  setId(id: number) {
    this.id = id;
  }
}
