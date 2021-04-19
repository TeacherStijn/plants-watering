import {ModalService} from "../shared/modal.service";
import {Component, Input, Output} from "@angular/core";
import {Item} from "../shared/models/item.model";
import {Grond} from "../shared/models/grond.model";
import {Gieter} from "../shared/models/gieter.model";
import {Schep} from "../shared/models/schep.model";
import {Rarity} from "../shared/models/rarity.model";
import {InventoryService} from "../shared/inventory.service";
import {ShopService} from "../shared/shop.service";

@Component({
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent {

  constructor(private modalService: ModalService,
              private inventoryService: InventoryService,
              private shopService: ShopService) { }

  sell(ev) {
    /*Zorg ervoor dat hij niet denkt dat we
    wederom op het grijze 'ik wil iets verkopen' vlak klikken*/
    ev.stopPropagation();

    const item = this.inventoryService.currentActie;
    if (item !== undefined) {
      if (!(item instanceof Grond) &&
        !(item instanceof Gieter) &&
        !(item instanceof Schep)) {
        console.log('Probeer te verkopen: ' + item.type);
        this.shopService.sell(item);
        this.inventoryService.actieBus$.next(new Gieter(1, Rarity.COMMON));
        this.inventoryService.resetCursor();
        this.shopService.soldItem = item;
      }
    }

    this.shopService.sellItem = undefined;
    this.close();
  }

  cancelSell() {
    this.shopService.sellItem = undefined;
    this.close();
  }

  public close() {
    this.modalService.destroy();
  }
}
