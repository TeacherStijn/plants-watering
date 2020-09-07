export class Item {
  description;
  aankoopprijs;
  constructor(public id?: number, public type?: string) {
  }

  get image() {
    return null;
  }

  get verkoopprijs() {
    return this.aankoopprijs / 4;
  }
}
