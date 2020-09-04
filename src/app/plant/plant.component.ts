import {Component, Input, OnInit} from '@angular/core';
import {Plant} from "../shared/models/plant.model";
import {InventoryService} from "../shared/inventory.service";
import {PlantenService} from "../shared/planten.service";
import {Achievement} from "../shared/models/achievement.model";
import {AchievementService} from "../shared/achievement.service";
import {Grond} from "../shared/models/grond.model";
import {Item} from "../shared/models/item.model";

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css']
})
export class PlantComponent implements OnInit {

  actie: Item;
  numClicksOpPlanten: number = 0;

  constructor(
    private inventoryService: InventoryService,
    private plantenService: PlantenService,
    private achievementService: AchievementService
  ) {}

  ngOnInit() {
    this.inventoryService.actieBus$.subscribe(
      (data) => {
        this.actie = data;
        console.log("Huidige actie = " + data.type);
      }
    );

    if (window.localStorage.getItem('planten') != undefined &&
      !(JSON.parse(window.localStorage.getItem('planten')) instanceof Array)) {
      // ophalen Planten
      console.log('Opgeslagen data gevonden');
      let local = JSON.parse(window.localStorage.getItem('planten'));
      local = [...local];
      local.forEach(
        (elem) => {
          this.plantenService.plantenBus$.next(elem);
        }
      );
    } else {
      // Nog even het aantal planten aanpassen
      // naar screensize % 50px op x en y as
      for (let a = 0; a <= 150; a++) {
        this.plantenService.plantenBus$.next(
          new Grond(a)
        );
      }
    }
  }

  acties(plantje) {
    // Het is aan het plantje zélf om te level-uppen
    // Echter liggen de condities hier in de controller vast
    console.log(this.actie);
    if (this.actie == undefined) {
      this.actie = new Item("gieter");
    }

    this.numClicksOpPlanten++;
    if (this.numClicksOpPlanten === 1) {
      this.achievementService.achievementBus$.next("And so it begins");
    }

    if (this.actie.type === 'gieter') {
      const now: any = new Date().getTime();

      if (now - plantje.recentWaterTime >= 1000) {
        console.log('Two minutes (1 sec) have passed');
        const levelResult = plantje.levelUp();
        plantje.recentWaterTime = now;

        // Check of teruggegeven item plantje is en dood is
        if (levelResult instanceof Plant && levelResult.level == 0) {
          this.plantenService.planten.splice(this.plantenService.planten.indexOf(levelResult), 1);
        }

        if (levelResult !== undefined) {
          this.inventoryService.inventoryBus$.next(levelResult);
        }
      } else {
        console.log('Plant recently received water');
      }
    } else if (this.actie.type === 'schep') {
      const verwijderd = this.plantenService.planten.splice(this.plantenService.planten.indexOf(plantje), 1);
      this.inventoryService.inventoryBus$.next(verwijderd[0]);
    } else if (this.actie.type.toLowerCase() === 'grond') {
      alert("You could plant a seed here");
    } else if (this.actie.type.toLowerCase() === 'seed') {
      // zaadjes?
      alert("Planting a seed...");
      // Nieuwe plant:
      const newPlant = new Plant(plantje.name, 1, new Date().getUTCMilliseconds(), plantje.rarity);
      this.plantenService.replace(plantje, this.actie);
      // vervangen 'plantje' door 'seed' (welke?) logo
    } else {
      // er is op iets anders geklikt
    }
  }
}
