import {Component, OnInit} from '@angular/core';
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
    private achievementService: AchievementService,
    private shopService: ShopService,
    private coinService: CoinService
  ) {}

  ngOnInit() {
    this.inventoryService.actieBus$.subscribe(
      (data) => {
        this.actie = data;
        console.log('Huidige actie = ' + data.type);
      }
    );

    const plantStorage = window.localStorage.getItem('planten');
    if (plantStorage != undefined &&
      JSON.parse(plantStorage).length > 0) {
      console.log(JSON.parse(plantStorage).length + ' Opgeslagen planten gevonden');
      let local = JSON.parse(plantStorage);
      local = [...local];
      local.forEach(
        (elem) => {
          console.log(elem.type);
          switch (elem.type.toLowerCase()) {
            case 'grond':
              elem = new Grond();
              break;
            case 'plant':
              // eigenlijk is name.key readonly
              // ALS het al gemodelleerd zou zijn
              elem = new Plant(PlantNames[elem.name.key], elem.level, elem.id);
              break;
            case 'seed':
              // eigenlijk is name.key readonly
              // ALS het al gemodelleerd zou zijn
              elem = new Seed(PlantNames[elem.name.key]);
          }
          this.plantenService.plantenBus$.next(elem);
        }
      );
    } else {
      console.log("Geen bestaande data voor grond gevonden");
      for (let y = 1; y <= this.aantalY; y++) {
        for (let x = 1; x <= this.aantalX; x++) {
          this.plantenService.plantenBus$.next(
            new Grond()
          );
        }
      }
    }
  }

  acties(clickedSquare) {
    // Het is aan het plantje zélf om te level-uppen
    // Echter liggen de condities hier in de controller vast
    if (this.actie === undefined) {
      this.actie = new Gieter(1, Rarity.COMMON);
    }

    this.numClicksOpPlanten++;
    if (this.numClicksOpPlanten === 1) {
      this.achievementService.achievementBus$.next("And so it begins");
    }

    if (this.actie.type.toLowerCase() === 'gieter') {
      const now: any = new Date().getTime();

      if (now - clickedSquare.recentWaterTime >= 1000) {
        const levelResult = clickedSquare.levelUp();
        clickedSquare.recentWaterTime = now;

        // Check of teruggegeven item plantje is en dood is
        if (levelResult instanceof Plant && levelResult.level === 0) {
          this.plantenService.planten.splice(this.plantenService.planten.indexOf(levelResult), 1);
        }
      } else {
        console.log('Plant recently received water (te recent of uberhaupt)');
      }
    } else if (this.actie.type.toLowerCase() === 'schep') {
      // Scheppen van grond heeft geen zin
      if (!(clickedSquare instanceof Grond)) {

        // Alleen mogelijk maken indien je LEVEL
        // vd schep hoger is dan plant?
        // Dus: schep 1 bijv level 5 maken
        // Schep 2 bijv level 10 maken
        // enzovoorts! Check nog inbouwen =)
        const verwijderd = this.plantenService.planten.splice(this.plantenService.planten.indexOf(clickedSquare), 1, new Grond());
        this.inventoryService.inventoryBus$.next(verwijderd[0]);
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
    localStorage.setItem('planten', JSON.stringify(this.plantenService.planten));
    localStorage.setItem('inventory', JSON.stringify(this.inventoryService.items));
    localStorage.setItem('shop', JSON.stringify(this.shopService.items));
    localStorage.setItem('achivements', JSON.stringify(this.achievementService.achievements));
    localStorage.setItem('coins', JSON.stringify(this.coinService.coins));
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
    return { 'width': + (100/this.aantalX) + '%'
      , 'height': '100px'
      , 'background-color': kleur
      , 'opacity': type == 'plant' || type == 'seed' ? 0.7 : 1
    };
  }
}
