import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ShopService} from "../shared/shop.service";
import {InventoryService} from "../shared/inventory.service";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnChanges {

  goldlings: number = 1;
  constructor(private shopService: ShopService,
              private inventoryService: InventoryService) { }

  ngOnInit() {
  }

  buy(item) {
    const result = this.shopService.buy(item);
    alert(result);
  }

  sell(item) {
    this.inventoryService.verwijderBus$.next(item);
    this.goldlings += item.verkoopprijs;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // check of het om goldlings gaat;
    // dan sound afspelen
    if (changes.goldlings) {
      const audio = new Audio('../assets/sell.wav');
      audio.play();
    }
  }
}
