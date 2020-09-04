export class Achievement {
  constructor(public id: number
            , public titel: string
            , public done: boolean = false
            , public omschrijving?: string
            ) {

  }

  event(doelObj: any
      , waarden: any[]
      , doelProperties: any[]
  ): void {
    doelProperties.forEach(
      (prop, index) => {
        doelObj[prop] = waarden[index];
      }
    );
  }

  get image() {
    return "trophy.jpg";
  }
}
