import roundMillisecondsToLastMinute from 'shared/helpers/round-milliseconds-to-last-minute';
import { IFeedingType, IFeedingEntry } from 'shared/types/types';

export default class FeedingEntry {
  private id: number | undefined;
  private created: number = 0;
  private stopped: number = 0;
  private type: IFeedingType = 'Left';
  private pauseStart: number = 0;
  private pauseDuration: number = 0;
  private volume: number = 0;

  constructor(feedingObject: Pick<IFeedingEntry, 'type'> & Partial<IFeedingEntry>) {
    this.id = feedingObject.id || undefined;
    this.created = feedingObject.created || new Date().getTime();
    this.stopped = feedingObject.stopped || 0;
    this.type = feedingObject.type;
    this.pauseStart = feedingObject.pauseStart || 0;
    this.pauseDuration = feedingObject.pauseDuration || 0;
    this.volume = feedingObject.volume || 0;
  }

  stop(): void {
    if (this.pauseStart !== 0) {
      this.continue();
    }
    if (this.pauseDuration < 60000) {
      this.pauseDuration = 0;
    }
    this.pauseDuration = roundMillisecondsToLastMinute(this.pauseDuration);
    this.stopped = new Date().getTime();
  }

  getDuration(): number {
    return (this.stopped || new Date().getTime()) - this.created - this.pauseDuration;
  }

  pause(): void {
    this.pauseStart = new Date().getTime();
  }

  continue(): void {
    this.pauseDuration = this.pauseDuration + new Date().getTime() - this.pauseStart;
    this.pauseStart = 0;
  }

  toObject(): IFeedingEntry {
    return {
      id: this.id,
      created: this.created,
      stopped: this.stopped,
      type: this.type,
      pauseStart: this.pauseStart,
      pauseDuration: this.pauseDuration,
      volume: this.volume,
    };
  }

  isPaused(): boolean {
    return !!this.pauseStart;
  }

  isRunning(): boolean {
    return !this.stopped && !this.isPaused();
  }

  getCurrentPauseDuration() {
    return new Date().getTime() - this.pauseStart;
  }

  getPauseDuration() {
    return this.pauseDuration;
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
