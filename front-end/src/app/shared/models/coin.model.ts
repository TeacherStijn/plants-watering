import {Item} from "./item.model";

export class Coin extends Item {
  constructor(public waarde: number) {
    super();
    this.type = this.constructor.name;
    console.log("Gemaakt: " + this.type);
  }

  get image() {
    if (this.waarde < 10) {
      return 'coin.png';
    } else if (this.waarde >= 10) {
      return 'coin_10.png';
    }
  }
}
