import {Injectable} from "@angular/core";
import {Item} from "./models/item.model";
import {Subject} from "rxjs";
import {Seed} from "./models/seed.model";
import {Rarity} from "./models/rarity.model";
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

    if (window.localStorage.getItem('shop') != undefined &&
      !(JSON.parse(window.localStorage.getItem('shop')) instanceof Array)) {
      console.log('Opgeslagen shop items gevonden');
      let local = JSON.parse(window.localStorage.getItem('shop'));
      local = [...local];
      local.forEach(
        (elem) => {
          this.itemBus$.next(elem);
        }
      );
    } else {
      this.items.push(new Plant(PlantNames.CHAMOMILE, 1));
      this.items.push(new Plant(PlantNames.DANDELION, 1));
      this.items.push(new Seed(PlantNames.CHAMOMILE));
      this.items.push(new Seed(PlantNames.CHAMOMILE));
      this.items.push(new Seed(PlantNames.CHAMOMILE));
      this.items.push(new Seed(PlantNames.CHAMOMILE));
    }
  }

  buy(item) {
    this.items = this.items.filter(
      (data) => {
        return data !== item;
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
