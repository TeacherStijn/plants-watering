import {Component, OnInit} from '@angular/core';
import {Plant} from "../shared/models/plant.model";
import {InventoryService} from "../shared/inventory.service";
import {PlantenService} from "../shared/planten.service";
import {AchievementService} from "../shared/achievement.service";
import {Grond} from "../shared/models/grond.model";
import {Item} from "../shared/models/item.model";
import {Gieter} from "../shared/models/gieter.model";
import {Rarity} from "../shared/models/rarity.model";

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css']
})
export class PlantComponent implements OnInit {

  aantalX = 8;
  aantalY = 8;
  imgWidth = window.innerWidth / this.aantalX;

  actie: Item = new Item(new Date().getUTCMilliseconds(), 'gieter');
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
      for (let y = 1; y <= this.aantalY; y++) {
        for (let x = 1; x <= this.aantalX; x++) {
          this.plantenService.plantenBus$.next(
            new Grond()
          );
        }
      }
    }
  }

  acties(item) {
    // Het is aan het plantje zélf om te level-uppen
    // Echter liggen de condities hier in de controller vast
    console.log(this.actie);
    if (this.actie === undefined) {
      this.actie = new Gieter(1, Rarity.COMMON);
    }

    this.numClicksOpPlanten++;
    if (this.numClicksOpPlanten === 1) {
      this.achievementService.achievementBus$.next("And so it begins");
    }

    if (this.actie.type.toLowerCase() === 'gieter') {
      const now: any = new Date().getTime();

      if (now - item.recentWaterTime >= 1000) {
        console.log('Two minutes (1 sec) have passed');
        const levelResult = item.levelUp();
        item.recentWaterTime = now;

        // Check of teruggegeven item plantje is en dood is
        if (levelResult instanceof Plant && levelResult.level === 0) {
          this.plantenService.planten.splice(this.plantenService.planten.indexOf(levelResult), 1);
        }

        if (levelResult !== undefined) {
          this.inventoryService.inventoryBus$.next(levelResult);
        }
      } else {
        console.log('Plant recently received water');
      }
    } else if (this.actie.type.toLowerCase() === 'schep') {
      // Scheppen van grond heeft geen zin
      if (!(item instanceof Grond)) {
        const verwijderd = this.plantenService.planten.splice(this.plantenService.planten.indexOf(item), 1, new Grond());
        this.inventoryService.inventoryBus$.next(verwijderd[0]);
      }
    } else if (this.actie.type.toLowerCase() === 'seed') {
      // Nog verder customizen?
      // Of is .name en .rarity voldoende?

      // Onderstaand nieuwe plant op basis van Seed name =) en Seed rarity =)
      const newPlant = new Plant(item.name, 1, new Date().getUTCMilliseconds(), item.rarity);
      this.plantenService.replace(item, newPlant);
      this.inventoryService.verwijderBus$.next(this.actie);
      this.actie = new Item(new Date().getUTCMilliseconds(), 'gieter');
      this.inventoryService.resetCursor();
    } else {
      // er is op iets anders geklikt
    }
  }
}
