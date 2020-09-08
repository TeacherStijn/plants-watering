import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Item} from "./models/item.model";
import {Coin} from "./models/coin.model";
import {ShopService} from "./shop.service";
import {CoinService} from "./coin.service";

@Injectable(
  { providedIn: 'root' }
)
export class InventoryService {
  inventoryBus$: Subject<Item>;
  verwijderBus$: Subject<Item>;
  actieBus$: Subject<Item>;
  currentActie: Item;
  items: Item[] = [];

  constructor(private coinService: CoinService) {
    this.inventoryBus$ = new Subject<Item>();
    this.verwijderBus$ = new Subject<Item>();
    this.actieBus$ = new Subject<Item>();

    this.inventoryBus$.subscribe(
      (data) => {
        if (data instanceof Coin) {
          this.coinService.coinBus$.next(data);
        } else {
          this.items.push(data);
        }
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
