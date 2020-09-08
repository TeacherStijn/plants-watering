import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ShopService} from "../shared/shop.service";
import {InventoryService} from "../shared/inventory.service";
import {Item} from "../shared/models/item.model";
import {CoinService} from "../shared/coin.service";
import {Gieter} from "../shared/models/gieter.model";
import {Rarity} from "../shared/models/rarity.model";
import {Grond} from "../shared/models/grond.model";
import {Schep} from "../shared/models/schep.model";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnChanges {

  sellItem: Item;
  soldItem: Item;
  constructor(private shopService: ShopService,
              private inventoryService: InventoryService,
              private coinService: CoinService) { }

  ngOnInit() {
  }

  buy(item) {
    if (this.coinService.coins >= item.aankoopprijs) {
      const result = this.shopService.buy(item);
      alert(result);
    } else {
      alert('Je hebt niet genoeg geld');
    }
  }

  preSell() {
    const item = this.inventoryService.currentActie;

    if (!(item instanceof Grond) &&
      !(item instanceof Gieter) &&
      !(item instanceof Schep)) {
      this.sellItem = item;
    } else {
      alert("You can't sell this!");
    }
  }

  sell() {
    const item = this.inventoryService.currentActie;
    if (item !== undefined) {
      if (!(item instanceof Grond) &&
        !(item instanceof Gieter) &&
        !(item instanceof Schep)) {
        console.log('Probeer te verkopen: ' + item.type);
        this.shopService.sell(item);
        this.inventoryService.actieBus$.next(new Gieter(1, Rarity.COMMON));
        this.inventoryService.resetCursor();
        this.soldItem = item;
      }
    }

    this.sellItem = undefined;
  }

  cancelSell() {
    this.sellItem = undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // check of het om goldlings gaat;
    // dan sound afspelen
    if (changes.coinService) {
      const audio = new Audio('../assets/sell.wav');
      audio.play();
    }
  }
}
