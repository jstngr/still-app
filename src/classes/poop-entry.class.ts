import { IPoopEntry } from 'shared/types/types';

export default class PoopEntry {
  private id: number | undefined;
  private created: number = 0;

  constructor(feedingObject: Partial<IPoopEntry>) {
    this.id = feedingObject.id || undefined;
    this.created = feedingObject.created || new Date().getTime();
  }

  toObject(): IPoopEntry {
    return {
      id: this.id,
      created: this.created,
    };
  }

  getId() {
    return this.id;
  }

  setId(id: number) {
    this.id = id;
  }
}
