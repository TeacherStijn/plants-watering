import {Component, OnInit} from '@angular/core';
import {InventoryService} from "../shared/inventory.service";
import {Item} from "../shared/models/item.model";
import {Seed, SeedNames} from "../shared/models/seed.model";
import {Rarity} from "../shared/models/rarity.model";
import {Schep} from "../shared/models/schep.model";
import {Gieter} from "../shared/models/gieter.model";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  gieter: Gieter;
  schep: Schep;

  constructor(private inventoryService: InventoryService) {
    this.gieter = new Gieter(1, Rarity.COMMON);
    this.schep = new Schep(1, Rarity.COMMON);
  }

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
        this.inventoryService.inventoryBus$.next(new Seed(new Date().getUTCMilliseconds(), SeedNames.SIMPLE, Rarity.COMMON));
      }
    }
  }

  setActie(actie: any, ev): void {
    const imgPad = actie.image.substr(0, actie.image.length-4) + "_ico." + actie.image.substr(actie.image.indexOf(".")+1);
    document.body.style.cursor = "url('../assets/images/" + imgPad + "'), auto";

    if (actie instanceof Item) {
      this.inventoryService.actieBus$.next(actie);
    }
  }
}
