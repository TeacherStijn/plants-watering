import {Item} from "./item.model";
import {Rarity} from "./rarity.model";

export class Plant extends Item {
  static MAX_LEVEL = 8;
  recentWaterTime: any;

  constructor(public name: string, public level: number, public id?: number, public rarity?: Rarity, public specs?: string) {
    super();
    this.type = this.constructor.name;
    this.recentWaterTime = new Date().getTime();
  }

  get image() {
    return (this.level > Plant.MAX_LEVEL ? Plant.MAX_LEVEL : this.level) + '.png';
  }

  get aankoopprijs() {
    // Berekening moet beter, o.a. op basis van level!
    return (this.rarity.value.aankoopPrijsSeed * this.rarity.value.plantModifier) * (this.level);
  }

  levelUp() {
    if (this.level !== 0 && this.level < Plant.MAX_LEVEL) {
      this.level++;
    } else { // moet iets nauwkeuriger
      this.level++;
    }

    if (this.level > Plant.MAX_LEVEL + 5) {
      alert('Plant died... rip!');
      this.level = 0;
      return this;
    }
  }
}
