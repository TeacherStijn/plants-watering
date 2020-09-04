import {Plant} from "./plant.model";

export class DeadPlant extends Plant {
  constructor(public name: string, public level: number) {
    super(name, level);
  }
}
