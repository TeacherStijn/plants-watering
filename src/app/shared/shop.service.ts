import {Injectable} from "@angular/core";
import {Item} from "./models/item.model";
import {Subject} from "rxjs";
import {Seed} from "./models/seed.model";
import {InventoryService} from "./inventory.service";
import {Coin} from "./models/coin.model";
import {CoinService} from "./coin.service";
import {Plant, PlantNames} from "./models/plant.model";

@Injectable(
  { providedIn: 'root' }
)
export class ShopService {
  items: Item[] = [];
  itemBus$: Subject<Item>;

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
    this.inventoryService.verwijderBus$.next(item);
    this.coinService.coinBus$.next(new Coin(item.verkoopprijs));
  }
}
