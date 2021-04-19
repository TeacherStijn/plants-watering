import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ShopService} from "../shared/shop.service";
import {InventoryService} from "../shared/inventory.service";
import {Item} from "../shared/models/item.model";
import {CoinService} from "../shared/coin.service";
import {Gieter} from "../shared/models/gieter.model";
import {Rarity} from "../shared/models/rarity.model";
import {Grond} from "../shared/models/grond.model";
import {Schep} from "../shared/models/schep.model";
import {Plant, PlantNames} from "../shared/models/plant.model";
import {Seed} from "../shared/models/seed.model";
import {Coin} from "../shared/models/coin.model";
import {ModalService} from "../shared/modal.service";
import {SellComponent} from "./sell.component";
import {BuyComponent} from "./buy.component";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnChanges {

  constructor(private modalService: ModalService,
              private shopService: ShopService,
              private inventoryService: InventoryService,
              private coinService: CoinService) { }

  ngOnInit() {
  }

  buy(item) {
    if (this.coinService.coins >= item.aankoopprijs) {

      this.shopService.buyItem = item;
      /* MODAL POPUP MAKEN */
      const inputs = {
         buyItem: this.shopService.buyItem
      }
      this.modalService.init(BuyComponent, inputs, { buyItem: this.shopService.buyItem});
    } else {
      alert('Je hebt niet genoeg geld. Nodig: ' + item.aankoopprijs);
    }
  }

  preSell() {
    const item = this.inventoryService.currentActie;

    if (!(item instanceof Grond) &&
      !(item instanceof Gieter) &&
      !(item instanceof Schep)) {
      this.shopService.sellItem = item;

      /* MODAL POPUP MAKEN */
      const inputs = {
        // sellItem: this.shopService.sellItem
      }
      this.modalService.init(SellComponent, inputs, { soldItem: this.shopService.soldItem});
      console.log('Voorgestelde prijs: ' + this.shopService.sellItem.verkoopprijs);
    } else {
      alert('Dit kun je niet verkopen.');
      console.log('Type: ' + item.type);
    }
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
