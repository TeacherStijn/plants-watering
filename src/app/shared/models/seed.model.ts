import {Grond} from "./grond.model";
import {Rarity} from "./rarity.model";
import {Item} from "./item.model";

export class Seed extends Item {
  constructor(public id: number, public name: SeedNames, public rarity: Rarity) {
    super();
    this.type = this.constructor.name;
    this.description = "A seed is used to plant in soil and (hopefully) grow a plant out of!";
  }

  get image() {
    return this.name.valueOf();
  }
}

export enum SeedNames {
  SIMPLE = "seed.png",
  MEDIOCRE = "medium.png"
}
