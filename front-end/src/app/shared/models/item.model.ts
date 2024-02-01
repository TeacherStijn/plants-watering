import {PlantNames} from "./plant.model";

export class Item {
  description;
  aankoopprijs;
  rarity?;
  constructor(public id?: number, public type?: string, public name?: string | any, public shopPersistent: boolean = false) {
  }

  get image() {
    return null;
  }

  get verkoopprijs() {
    return this.aankoopprijs / 2;
  }
}