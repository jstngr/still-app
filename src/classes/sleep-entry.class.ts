import { ISleepEntry } from 'shared/types/types';

export default class SleepEntry {
  private id: number | undefined;
  private created: number = 0;
  private stopped: number = 0;

  constructor(sleepObject: Partial<ISleepEntry>) {
    this.id = sleepObject.id || undefined;
    this.created = sleepObject.created || new Date().getTime();
    this.stopped = sleepObject.stopped || 0;
  }

  stop(): void {
    this.stopped = new Date().getTime();
  }

  getDuration(): number {
    return (this.stopped || new Date().getTime()) - this.created;
  }

  toObject(): ISleepEntry {
    return {
      id: this.id,
      created: this.created,
      stopped: this.stopped,
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
