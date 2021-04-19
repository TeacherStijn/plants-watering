import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Item} from "./models/item.model";
import {Coin} from "./models/coin.model";
import {CoinService} from "./coin.service";
import {Schep} from "./models/schep.model";
import {Gieter} from "./models/gieter.model";

@Injectable(
  { providedIn: 'root' }
)
export class InventoryService {
  inventoryBus$: Subject<Item>;
  permanentStorageBus$: Subject<Item>;
  verwijderBus$: Subject<Item>;
  actieBus$: Subject<Item>;
  currentActie: Item;
  items: Item[] = [];
  permanentStorage: Item[] = [];

  constructor(private coinService: CoinService) {
    this.inventoryBus$ = new Subject<Item>();
    this.permanentStorageBus$ = new Subject<Item>();
    this.verwijderBus$ = new Subject<Item>();
    this.actieBus$ = new Subject<Item>();

    this.inventoryBus$.subscribe(
      (data) => {
        if (data instanceof Coin) {
          this.coinService.coinBus$.next(data);
        } else if (data instanceof Schep || data instanceof Gieter) {
          // Schep op juiste plek adden (en oude vervangen)
          this.permanentStorageBus$.next(data);
        } else {
          this.items.push(data);
        }
      }
    );

    this.permanentStorageBus$.subscribe(
      (data) => {
        // nu alleen nog even Gieter of Schep check
        // zijn voor nu de enige permanents
        if (data instanceof Gieter || data instanceof Schep) {
          console.log("Type!!" + data.type);
          const oudItem = this.permanentStorage.find(el => data.type == el.type);
          if (oudItem != undefined) {
            this.verwijderBus$.next(oudItem);
          }
          this.permanentStorage.push(data);
        }
      }
    );

    this.verwijderBus$.subscribe(
      (data) => {
        if (data instanceof Schep || data instanceof Gieter) {
          const found = this.permanentStorage.findIndex(
            (el) => {
              return el.id === data.id;
            }
          );
          console.log(found > -1 ? 'in inv gevonden' : 'niet in inv');
          if (found > -1) {
            this.permanentStorage.splice(found, 1);
          }
        } else {
          const found = this.items.findIndex(
            (el) => {
              return el.id === data.id;
            }
          );
          console.log(found > -1 ? 'in inv gevonden' : 'niet in inv');
          if (found > -1) {
            this.items.splice(found, 1);
          }
        }
      }
    );

    this.actieBus$.subscribe(
      (data) => {
        this.currentActie = data;
      }
    );
  }

  getCursor(): { cursor: string } {
    return {
      'cursor': 'url(../assets/images/' + this.currentActie.image + '), auto'
    };
  }

  resetCursor(): void {
    document.body.style.cursor = 'url(../assets/images/gieter_ico.png), auto';
  }
}
