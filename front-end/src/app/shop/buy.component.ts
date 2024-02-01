import {ModalService} from "../shared/modal.service";
import {Component, Input, Output} from "@angular/core";
import {Grond} from "../shared/models/grond.model";
import {Gieter} from "../shared/models/gieter.model";
import {Schep} from "../shared/models/schep.model";
import {Rarity} from "../shared/models/rarity.model";
import {InventoryService} from "../shared/inventory.service";
import {ShopService} from "../shared/shop.service";

@Component({
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent {

  result: string;

  constructor(private modalService: ModalService,
              private inventoryService: InventoryService,
              private shopService: ShopService) { }

  buy(ev) {
    ev.stopPropagation();
    const item = this.shopService.buyItem;
    if (item !== undefined) {
      console.log('Voorgestelde prijs: ' + this.shopService.buyItem.aankoopprijs);
      this.result = this.shopService.buy(item);
    }

    this.shopService.buyItem = undefined;
    setTimeout(() => this.close(), 2500);
  }

  cancelBuy() {
    this.shopService.buyItem = undefined;
    this.close();
  }

  public close() {
    this.modalService.destroy();
  }
}
