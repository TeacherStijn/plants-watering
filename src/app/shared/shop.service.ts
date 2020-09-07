import {Injectable} from "@angular/core";
import {Item} from "./models/item.model";
import {Subject} from "rxjs";
import {Seed, SeedNames} from "./models/seed.model";
import {Rarity} from "./models/rarity.model";
import {InventoryService} from "./inventory.service";

@Injectable(
  { providedIn: 'root' }
)
export class ShopService {
  items: Item[] = [];
  itemBus$: Subject<Item>;

  constructor(private inventoryService: InventoryService) {
    this.itemBus$ = new Subject<Item>();
    this.itemBus$.subscribe(
      (data) => {
        this.items.push(data);
      }
    );

    this.items.push(new Seed(SeedNames.SIMPLE, Rarity.COMMON));
    this.items.push(new Seed(SeedNames.SIMPLE, Rarity.COMMON));
    this.items.push(new Seed(SeedNames.MEDIOCRE, Rarity.UNCOMMON));
  }

  buy(item) {
    this.items = this.items.filter(
      (data) => {
        return data !== item;
      }
    );

    this.inventoryService.inventoryBus$.next(item);
    return `Item ${item.name} gekocht!`;
  }
}