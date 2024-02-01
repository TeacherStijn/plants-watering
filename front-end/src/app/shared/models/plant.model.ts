import {Item} from "./item.model";
import {Rarity} from "./rarity.model";

export class Plant extends Item {
  static MAX_LEVEL = 8;
  recentWaterTime: any;
  public readonly rarity: Rarity;

  constructor(public name: PlantNames, public level: number, public id?: number, public specs?: string) {
    super();
    this.type = this.constructor.name;
    if (this.id == undefined) {
      new Date().getUTCMilliseconds();
    }
    this.recentWaterTime = new Date().getTime();
    this.rarity = this.name.value.rarity;
  }

  get image() {
    // Deze op basis van level:
    // const pad = `plants/${this.name.toString().toLowerCase()}_${(this.level > Plant.MAX_LEVEL ? Plant.MAX_LEVEL : this.level)}.png`;
    const pad = `plants/${this.name.toString().toLowerCase()}.png`;
    return pad;
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

export class PlantNames {
  static readonly DAISY = new PlantNames('DAISY', { rarity: Rarity.COMMON });
  static readonly DANDELION = new PlantNames('DANDELION', { rarity: Rarity.COMMON });
  static readonly LAVENDER = new PlantNames('LAVENDER', { rarity: Rarity.UNCOMMON });
  static readonly MAY_LILY = new PlantNames('MAY_LILY', { rarity: Rarity.UNCOMMON } );

  private constructor(private readonly key: string, public readonly value: { rarity: Rarity }) {

  }

  public toString() {
    return this.key;
  }
}