import {Item} from "./item.model";
import {Rarity} from "./rarity.model";

export class Artifact extends Item {
  constructor() {
    super();

    // Willekeurige naam
    const RANDOM_ART_NR = Math.random() * (ARTIFACTNAMES.length - 1);
    this.name = ARTIFACTNAMES[RANDOM_ART_NR];

    // Willekeurige rareness
    const RANDOM_RARENESS_NR = Math.floor(Math.random() * 5);
    const rarities = [Rarity.COMMON, Rarity.UNCOMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY];
    this.rarity = rarities[RANDOM_RARENESS_NR];
  }

  get image() {
    // Deze op basis van level:
    // const pad = `plants/${this.name.toString().toLowerCase()}_${(this.level > Plant.MAX_LEVEL ? Plant.MAX_LEVEL : this.level)}.png`;
    const pad = `artifacts/${this.changeName()}.png`;
    return pad;
  }

  changeName(): string {
    return this.name.replace(' ', '').toLowerCase();
  }
}

export const ARTIFACTNAMES = ['Light feather', 'Twisting Orb', 'Thorium dobloon', 'Aetherflux Pendant'];
