import roundMillisecondsToLastMinute from 'shared/helpers/round-milliseconds-to-last-minute';
import { IBoob, IFeedingEntry } from 'shared/types/types';

export default class FeedingEntry {
  private id: number | undefined;
  private created: number = 0;
  private stopped: number = 0;
  private boob: IBoob = 'Left';
  private pauseStart: number = 0;
  private pauseDuration: number = 0;

  constructor(feedingObject: Pick<IFeedingEntry, 'boob'> & Partial<IFeedingEntry>) {
    this.id = feedingObject.id || undefined;
    this.created = feedingObject.created || new Date().getTime();
    this.stopped = feedingObject.stopped || 0;
    this.boob = feedingObject.boob;
    this.pauseStart = feedingObject.pauseStart || 0;
    this.pauseDuration = feedingObject.pauseDuration || 0;
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
      boob: this.boob,
      pauseStart: this.pauseStart,
      pauseDuration: this.pauseDuration,
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
