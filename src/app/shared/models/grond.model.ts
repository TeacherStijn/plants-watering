import {Item} from "./item.model";
import {Seed} from "./seed.model";

export class Grond extends Item {
  constructor(public id: number, public seed?: Seed) {
    super();
    this.type = 'grond';
  }

  get image() {
    return 'ground.jpg';
  }
}

