import {Item} from "./item.model";
import {Seed} from "./seed.model";

export class Grond extends Item {
  constructor(public seed?: Seed) {
    super();
    this.id = new Date().getUTCMilliseconds();
    this.type = 'grond';
  }

  get image() {
    return 'ground.jpg';
  }
}

