import {Component, Input, OnInit} from '@angular/core';
import {Plant, PlantNames} from "../shared/models/plant.model";
import {InventoryService} from "../shared/inventory.service";
import {PlantenService} from "../shared/planten.service";
import {AchievementService} from "../shared/achievement.service";
import {Grond} from "../shared/models/grond.model";
import {Item} from "../shared/models/item.model";
import {Gieter} from "../shared/models/gieter.model";
import {Rarity} from "../shared/models/rarity.model";
import {Seed} from "../shared/models/seed.model";
import {ShopService} from "../shared/shop.service";
import {CoinService} from "../shared/coin.service";
import {Schep} from "../shared/models/schep.model";
import {SaveService} from "../shared/save.service";

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css']
})
export class PlantComponent implements OnInit {

  imgWidth = window.innerWidth / this.saveService.aantalX;

  actie: Item = new Item(new Date().getUTCMilliseconds(), 'gieter');
  numClicksOpPlanten: number = 0;

  constructor(
    private saveService: SaveService,
    private inventoryService: InventoryService,
    private plantenService: PlantenService,
    private achievementService: AchievementService
  ) {}

  ngOnInit() {
    this.inventoryService.actieBus$.subscribe(
      (data) => {
        this.actie = data;
        console.log('Huidige actie = ' + data.type);
      }
    );
  }

  acties(clickedSquare) {
    // Het is aan het plantje zélf om te level-uppen
    // Echter liggen de condities hier in de controller vast

    if (clickedSquare.hasOwnProperty('bevat')) {
      // AAN INVENTORY het item BEVAT toevoegen
    }

    if (this.actie === undefined) {
      this.actie = new Gieter(1, Rarity.COMMON);
    }

    this.numClicksOpPlanten++;
    if (this.numClicksOpPlanten === 1) {
      this.achievementService.achievementBus$.next("And so it begins");
    }

    if (this.actie.type.toLowerCase() === 'gieter') {
      const now: any = new Date().getTime();

      // straks!:
      //if (now - clickedSquare.recentWaterTime >= (1000 * 60 * 60) * 2) {
      if (now - clickedSquare.recentWaterTime >= (1000)) {
        const levelResult = clickedSquare.levelUp();
        clickedSquare.recentWaterTime = now;

        // Check of teruggegeven item plantje is en dood is
        if (levelResult instanceof Plant && levelResult.level === 0) {
          this.plantenService.planten.splice(this.plantenService.planten.indexOf(levelResult), 1);
        }
      } else {
        console.log('Plant recently received water');
      }
    } else if (this.actie.type.toLowerCase() === 'schep') {
      // Scheppen van grond heeft geen zin
      if (!(clickedSquare instanceof Grond)) {
        const plantLevel = (clickedSquare as Plant).level;
        const levelNodig = Math.floor(plantLevel / Math.pow(10, plantLevel.toString().length - 1)) * Math.pow(10, plantLevel.toString().length - 1);

        if ((this.actie as Schep).level >= levelNodig) {
          const verwijderd = this.plantenService.planten.splice(this.plantenService.planten.indexOf(clickedSquare), 1, new Grond());
          this.inventoryService.inventoryBus$.next(verwijderd[0]);
        } else {
          alert('Je schep is nog niet sterk genoeg! (nodig is: level ' + levelNodig + ')');
        }
      }
    } else if (this.actie.type.toLowerCase() === 'seed') {
      // Nog verder customizen?
      // Of is .name en .rarity voldoende?

      // Onderstaand nieuwe plant op basis van Seed name =) en Seed rarity =)
      const huidigeSeed = this.actie as Seed; // ipv <Seed>this.actie
      const newPlant = new Plant(huidigeSeed.name, 1);
      this.plantenService.replace(clickedSquare, newPlant);
      this.inventoryService.verwijderBus$.next(this.actie);
      this.actie = new Item(new Date().getUTCMilliseconds(), 'gieter');
      // achievement anders dan Daisy check:
      if (huidigeSeed.name != PlantNames.DAISY) {
        this.achievementService.achievementBus$.next('New insights');
      }
      this.inventoryService.resetCursor();
    } else {
      // er is op iets anders geklikt
      console.log("whats this?");
      // Dit dus nog uitwerken; wanneer er op een plant
      // geklikt is en deze in de grond wordt gezet..
      // kán dat überhaupt?
    }
  }

  save() {
    this.saveService.save();
  }

  calcSize(item) {
    const level = item.level ?
                    item.level <= 10 ? item.level : 10
                    : 10;
    return {
      'width': level * 30 + '%',
      'height': level * 30 + '%'
    };
  }

  calcStyle(item) {
    const type = item.type.toLowerCase();
    const kleur = type == 'plant' || type == 'seed' ? item.name.value.rarity.value.color : 'none';
    if (type=='plant' || type=='seed') {
      console.log(item.name.value.rarity.value.color);
    }
    return { 'width': + (100/this.saveService.aantalX) + '%'
      , 'height': '100px'
      , 'background-color': kleur
      , 'opacity': type == 'plant' || type == 'seed' ? 0.7 : 1
    };
  }
}
