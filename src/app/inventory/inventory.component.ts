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

  constructor(private inventoryService: InventoryService) {
  }

  ngOnInit() {

  }

  setActie(actie: any): void {
    const imgPad = actie.image.substr(0, actie.image.length-4) + "_ico." + actie.image.substr(actie.image.indexOf(".")+1);
    document.body.style.cursor = "url('../assets/images/" + imgPad + "'), auto";

    if (actie instanceof Item) {
      this.inventoryService.actieBus$.next(actie);
    }
  }
}
