import {Item} from "./item.model";
import {Seed} from "./seed.model";

export class Grond extends Item {
  bevat: Item;

  constructor(public seed?: Seed) {
    super();
    this.id = new Date().getUTCMilliseconds();
    this.type = 'Grond';
  }

  get image() {
    return 'ground.jpg';
  }
}

