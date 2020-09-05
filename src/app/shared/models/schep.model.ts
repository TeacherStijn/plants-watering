import {Item} from "./item.model";
import {Rarity} from "./rarity.model";

export class Schep extends Item {
  constructor(public level: number, public rarity: Rarity) {
    super();
    this.id = new Date().getUTCMilliseconds();
    this.type = this.constructor.name;
  }

  get image() {
    return "schep.png";
  }
}
