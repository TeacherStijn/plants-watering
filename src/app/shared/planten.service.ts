import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Plant} from "./models/plant.model";
import {Item} from "./models/item.model";
import {Grond} from "./models/grond.model";

@Injectable(
  { providedIn: 'root' }
)
export class PlantenService {
  plantenBus$: Subject<Item>
  planten: Item[] = []; // eigenlijk iets te generiek met 'Item'

  constructor() {
    this.plantenBus$ = new Subject<Item>();
    this.plantenBus$.subscribe(
      (data) => {
        if (data instanceof Plant || data instanceof Grond) {
          this.planten.push(data);
        }
      }
    );
  }

  replace(doel, bron): void {
    const index = this.planten.findIndex(
      (el) => {
        return el === doel;
      }
    );
    if (index >= 1) {
      // klasse hier of in plant component
      // instantieren van Plantje o.b.v. deze Seed
      // op level 1 (stekje)
      this.planten.splice(index, 1, bron);
    } else {
      console.log ("Te vervangen plek niet gevonden");
    }
  }
}
