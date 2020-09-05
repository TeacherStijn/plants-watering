import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Item} from "./models/item.model";

@Injectable(
  { providedIn: 'root' }
)
export class InventoryService {
  inventoryBus$: Subject<Item>;
  verwijderBus$: Subject<Item>;
  actieBus$: Subject<Item>;
  items: Item[] = [];

  constructor() {
    this.inventoryBus$ = new Subject<Item>();
    this.verwijderBus$ = new Subject<Item>();
    this.actieBus$ = new Subject<Item>();

    this.inventoryBus$.subscribe(
      (data) => {
        this.items.push(data);
      }
    );

    this.verwijderBus$.subscribe(
      (data) => {
        const found = this.items.findIndex(
          (el) => {
            return el.id === data.id;
          }
        );
        if (found > -1) {
          this.items.splice(found, 1);
        }
      }
    );
  }
}
