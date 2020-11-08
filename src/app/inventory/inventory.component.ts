import {Component, OnInit} from '@angular/core';
import {InventoryService} from "../shared/inventory.service";
import {Item} from "../shared/models/item.model";
import {Seed} from "../shared/models/seed.model";
import {Rarity} from "../shared/models/rarity.model";
import {Schep} from "../shared/models/schep.model";
import {Gieter} from "../shared/models/gieter.model";
import {Plant, PlantNames} from "../shared/models/plant.model";

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
    this.schep = new Schep(5, Rarity.COMMON);
  }

  ngOnInit() {
    const inventoryStorage = window.localStorage.getItem('inventory');
    if (inventoryStorage != undefined &&
      JSON.parse(inventoryStorage).length > 0) {
      // ophalen Inventory
      console.log('Opgeslagen inventory data gevonden: ');
      console.dir(JSON.parse(inventoryStorage));
      let local = JSON.parse(inventoryStorage);
      local = [...local];
      local.forEach(
        (elem) => {
          switch (elem.type.toLowerCase()) {
            case 'seed':
              // eigenlijk is name.key readonly
              // ALS het al gemodelleerd zou zijn
              elem = new Seed(PlantNames[elem.name.key]);
              break;
            case 'plant':
              // eigenlijk is name.key readonly
              // ALS het al gemodelleerd zou zijn
              elem = new Plant(PlantNames[elem.name.key], elem.level, elem.id);
              break;
            default:
              console.log('Inventory bevat unknown item');
          }
          this.inventoryService.inventoryBus$.next(elem);
        }
      );
    } else {
      // lege inventory (clean / begin item?)
      // gratis 10 zaadjes
      console.log('Nieuwe lege inventory met 10 seeds');
      for (let i = 0; i <= 10; i++) {
        this.inventoryService.inventoryBus$.next(new Seed(PlantNames.CHAMOMILE));
      }
    }
  }

  setActie(actie: any): void {
    const imgPad = actie.image.substr(0, actie.image.length-4) + "_ico." + actie.image.substr(actie.image.indexOf(".")+1);
    document.body.style.cursor = "url('../assets/images/" + imgPad + "'), auto";

    if (actie instanceof Item) {
      this.inventoryService.actieBus$.next(actie);
    }
  }
}
