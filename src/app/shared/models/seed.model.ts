import {Rarity} from "./rarity.model";
import {Item} from "./item.model";

export class Seed extends Item {
  constructor(public name: SeedNames, public rarity: Rarity) {
    super();
    this.id = new Date().getUTCMilliseconds();
    this.type = this.constructor.name;
    this.description = 'A seed is used to plant in soil and (hopefully) grow a plant out of!';
  }

  get image() {
    // Afhankelijk van NAME / RARITY image doen?
    // of enkel CSS kleur overlay / tekstkleur
    // op basis van Rarity.valueOf()
    //return this.name.valueOf();

    // Vervangen door ICON font met color overlay!
    return "seed.png"; // basic_seed.png?
  }

  get aankoopprijs() {
    switch (this.rarity) {
      case Rarity.COMMON: return 1; break;
      case Rarity.UNCOMMON: return 5; break;
      case Rarity.RARE: return 10; break;
      case Rarity.EPIC: return 40; break;
      case Rarity.LEGENDARY: return 100; break;
    }
  }
}

export enum SeedNames {
  SIMPLE = "seed.png",
  MEDIOCRE = "medium.png"
}
