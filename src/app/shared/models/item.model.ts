export class Item {
  description;
  aankoopprijs;
  rarity?;
  constructor(public id?: number, public type?: string) {
  }

  get image() {
    return null;
  }

  get verkoopprijs() {
    return this.aankoopprijs / 2;
  }
}
