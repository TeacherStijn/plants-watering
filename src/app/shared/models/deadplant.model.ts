import {Plant, PlantNames} from "./plant.model";

export class DeadPlant extends Plant {
  constructor(public name: PlantNames, public level: number) {
    super(name, level);
  }
}
