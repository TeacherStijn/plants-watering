import {Component, OnInit} from '@angular/core';
import {InventoryService} from "../shared/inventory.service";
import {Item} from "../shared/models/item.model";
import {Seed, SeedNames} from "../shared/models/seed.model";
import {Rarity} from "../shared/models/rarity.model";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    if (window.localStorage.getItem('inventory') != undefined &&
      !(JSON.parse(window.localStorage.getItem('inventory')) instanceof Array)) {
      // ophalen Inventory
      console.log('Opgeslagen data gevonden');
      let local = JSON.parse(window.localStorage.getItem('inventory'));
      local = [...local];
      local.forEach(
        (elem) => {
          this.inventoryService.inventoryBus$.next(elem);
        }
      );
    } else {
      // lege inventory (clean / begin item?)
      // gratis 10 zaadjes
      for (let i = 0; i <= 10; i++) {
        this.inventoryService.inventoryBus$.next(new Seed(SeedNames.SIMPLE, Rarity.COMMON));
      }
    }
  }

  setActie(actie: any): void {
    if (actie instanceof Item) {
      this.inventoryService.actieBus$.next(actie);
    } else if (typeof actie === 'string') {
      console.log("Actie type string");
      this.inventoryService.actieBus$.next(new Item(actie));
    }

  }

  icoonFix(elem) {
    const pad = elem.target.getAttribute("src");
    elem.target.style.cursor = "url('" + pad + "'), auto";
    console.log(elem.target.style.cursor);
  }
}
