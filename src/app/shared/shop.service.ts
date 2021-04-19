import {Injectable} from "@angular/core";
import {Item} from "./models/item.model";
import {Subject} from "rxjs";
import {InventoryService} from "./inventory.service";
import {Coin} from "./models/coin.model";
import {CoinService} from "./coin.service";
import {Seed} from "./models/seed.model";
import {Gieter} from "./models/gieter.model";
import {Schep} from "./models/schep.model";

@Injectable(
  { providedIn: 'root' }
)
export class ShopService {
  items: Item[] = [];
  itemBus$: Subject<Item>;
  sellItem: Item;
  soldItem: Item;
  buyItem: Item;

  constructor(private inventoryService: InventoryService,
              private coinService: CoinService) {
    this.itemBus$ = new Subject<Item>();
    this.itemBus$.subscribe(
      (data) => {
        this.items.push(data);
      }
    );
  }

  buy(item) {
    this.items = this.items.filter(
      (data) => {
        // Checken of het een onbeperkt item is
        if (item.shopPersistent == false) {
          return data !== item;
        } else {
          return data;
        }
      }
    );

    this.inventoryService.inventoryBus$.next(item);
    this.coinService.coins -= item.aankoopprijs;
    return `Item ${item.name} gekocht!`;
  }

  sell(item) {
    // Schep en Gieter verkopen mag niet
    if (!(item instanceof Schep) && !(item instanceof Gieter)) {
      this.inventoryService.verwijderBus$.next(item);
    }
    this.coinService.coinBus$.next(new Coin(item.verkoopprijs));

    // Check of item (Seed) terug kan naar winkel
    // hij mag alleen niet shopPersistent zijn
    if (item instanceof Seed) {
      if (!item.shopPersistent) {
        this.itemBus$.next(item);
      }
    }
  }

  addToShop(item) {
    // wanneer je een item verkoopt,
    // weer terug in winkel brengen mechanisme
    // check dan wel of het om (enkel?) zaden gaat
  }
}
