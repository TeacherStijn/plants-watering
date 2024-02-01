import {Injectable} from "@angular/core";
import {AchievementService} from "./achievement.service";
import {CoinService} from "./coin.service";
import {InventoryService} from "./inventory.service";
import {PlantenService} from "./planten.service";
import {ShopService} from "./shop.service";
import {Grond} from "./models/grond.model";
import {Plant, PlantNames} from "./models/plant.model";
import {Seed} from "./models/seed.model";
import {Schep} from "./models/schep.model";
import {Gieter} from "./models/gieter.model";
import {Rarity} from "./models/rarity.model";
import {Coin} from "./models/coin.model";
import {EventCheckerService} from "./eventchecker.service";
import {SpecialGrond} from "./models/specialgrond.model";
import {Item} from "./models/item.model";
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class SaveService {
  aantalX = 8;
  aantalY = 8;
  user: { email: string, apiKey: string };
  gameData: {
    planten: string,
    inventory: string,
    permanentInventory: string,
    shop: string,
    achievements: string,
    coins: string
  };

  constructor(
    private http: HttpClient,
    private achievementService: AchievementService,
    private coinService: CoinService,
    private inventoryService: InventoryService,
    private plantenService: PlantenService,
    private shopService: ShopService,
    private eventChecker: EventCheckerService) {
  }

  loginUser(user: string, apiKeyInput: string): void {
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'api-key': this.user.apiKey
    });

    this.http.post('http://localhost:9007/api/login', JSON.stringify({ data: this.user.email }), { headers })
      .subscribe(
        (resp: { email: string, apiKey: string }) => {
          this.user = resp;
          localStorage.setItem('user', JSON.stringify(this.user));
          // Hier scherm netjes laten wachten en popup met: 'spel opgeslagen'
        },
        err => {
          // Hier scherm netjes laten wachten en popup met: 'spel opslaan niet gelukt'
          this.user = undefined;
        }
      );
  }

  checkUser(): boolean {
    return this.user != undefined;
  }

  new() {
    localStorage.clear();
  }

  save() {
    /* localStorage.setItem('planten', JSON.stringify(this.plantenService.planten));
    localStorage.setItem('inventory', JSON.stringify(this.inventoryService.items));
    localStorage.setItem('permanentInventory', JSON.stringify(this.inventoryService.permanentStorage));
    localStorage.setItem('shop', JSON.stringify(this.shopService.items));
    localStorage.setItem('achievements', JSON.stringify(this.achievementService.achievements));
    localStorage.setItem('coins', JSON.stringify(this.coinService.coins)); */

    this.checkUser();

    this.gameData = {
      planten: JSON.stringify(this.plantenService.planten),
      inventory: JSON.stringify(this.inventoryService.items),
      permanentInventory: JSON.stringify(this.inventoryService.permanentStorage),
      shop: JSON.stringify(this.shopService.items),
      achievements: JSON.stringify(this.achievementService.achievements),
      coins: JSON.stringify(this.coinService.coins)
    };

    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'api-key': this.user.apiKey
    });
    this.http.post('http://localhost:9007/api/save', JSON.stringify({ data: this.user.email, gameData: this.gameData }), { headers })
      .subscribe(
        resp => {
          // Hier scherm netjes laten wachten en popup met: 'spel opgeslagen'
        },
        err => {
          // Hier scherm netjes laten wachten en popup met: 'spel opslaan niet gelukt'
        }
      );
  }

  load() {
    this.checkUser();

    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'api-key': this.user.apiKey
    });

    this.http.post('http://localhost:9007/api/load', JSON.stringify({data: this.user.email}), {headers})
      .subscribe(
        (resp: {
          planten: string,
          inventory: string,
          permanentInventory: string,
          shop: string,
          achievements: string,
          coins: string
        }) => {
          this.gameData = resp;
          localStorage.setItem('planten', this.gameData.planten);
          localStorage.setItem('inventory', this.gameData.inventory);
          localStorage.setItem('permanentInventory', this.gameData.permanentInventory);
          localStorage.setItem('shop', this.gameData.shop);
          localStorage.setItem('achievements', this.gameData.achievements);
          localStorage.setItem('coins', this.gameData.coins);

          // Dit is even de vraag wanneer dit moet lopen? Bij starten spel al?
          this.loadingPartTwo();

        },
        err => {
          // Hier scherm netjes laten wachten en popup met: 'spel laden niet gelukt'
        }
      );
  }

  loadingPartTwo() {
      /* PLANTEN CHECK */
      const plantStorage = window.localStorage.getItem('planten');
      if (plantStorage != undefined &&
        JSON.parse(plantStorage).length > 0) {
        console.log(JSON.parse(plantStorage).length + ' Opgeslagen planten gevonden');
        let local = JSON.parse(plantStorage);
        local = [...local];
        /*

          CHECK INBOUWEN OF HUIDIGE CEL GEWOON GROND IS;
          DAN RANDOM MOGELIJKHEID BIEDEN!

         */
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

        const tileEvent = this.eventChecker.tileEvent(this.aantalX, this.aantalY);
        for (let y = 1; y <= this.aantalY; y++) {
          for (let x = 1; x <= this.aantalX; x++) {
            if (tileEvent && tileEvent.x === x && tileEvent.y === y) {
              const grond = new Grond();
              grond.bevat = tileEvent.item;
              this.plantenService.plantenBus$.next(
                grond
              );
            } else {
              this.plantenService.plantenBus$.next(
                new Grond()
              );
            }
          }
        }
      }

      /* INVENTORYSTORAGE CHECK */
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
          const startSeed = new Seed(PlantNames.DAISY);
          startSeed.shopPersistent = true;
          this.inventoryService.inventoryBus$.next(startSeed);
        }
      }

      /* PERMANENT INVENTORYSTORAGE CHECK */
      const permanentStorage = window.localStorage.getItem('permanentInventory');
      if (permanentStorage != undefined &&
        JSON.parse(permanentStorage).length > 0) {
        // ophalen Inventory
        console.log('Opgeslagen permanentInventory data gevonden: ');
        console.dir(JSON.parse(permanentStorage));
        let local = JSON.parse(permanentStorage);
        local = [...local];
        local.forEach(
          (elem) => {
            switch (elem.type.toLowerCase()) {
              case 'schep':
                elem = new Schep(elem.level, elem.rarity);
                break;
              case 'gieter':
                elem = new Gieter(elem.level, elem.rarity);
                break;
              default:
                console.log('PermanentInventory bevat unknown item');
            }
            this.inventoryService.permanentStorageBus$.next(elem);
          }
        );
      } else {
        // lege permanentinventory (clean / begin item)
        this.inventoryService.permanentStorageBus$.next(new Gieter(1, Rarity.COMMON));
        this.inventoryService.permanentStorageBus$.next(new Schep(9, Rarity.COMMON));
      }

      /* SHOP ITEMS CHECK */
      if (window.localStorage.getItem('shop') != undefined &&
        JSON.parse(window.localStorage.getItem('shop')).length > 0) {
        console.log('Opgeslagen shop items gevonden');
        let local = JSON.parse(window.localStorage.getItem('shop'));
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
                console.log('Winkel bevat unknown item (anders dan plant/seed');
            }
            this.shopService.itemBus$.next(elem);
          }
        );
      } else {
        /*Hier een check of de huidige datum tussen
        één of meer van de data reeksen zit?*/
        this.shopService.itemBus$.next(new Plant(PlantNames.DAISY, 1));
        this.shopService.itemBus$.next(new Plant(PlantNames.DANDELION, 1));
        const luxeSchep = new Schep(10, Rarity.RARE);
        luxeSchep.aankoopprijs = 100;
        this.shopService.itemBus$.next(luxeSchep);
        const perm1 = new Seed(PlantNames.DAISY);
        perm1.shopPersistent = true;
        this.shopService.itemBus$.next(perm1);
        console.log(perm1.shopPersistent);
        this.shopService.itemBus$.next(new Seed(PlantNames.LAVENDER));
      }

      /* COINSTORAGE CHECK */
      const coinStorage = window.localStorage.getItem('coins');
      if (coinStorage != undefined &&
        Number.parseInt(coinStorage) > 0) {
        console.log('Opgeslagen coins gevonden');
        const local = JSON.parse(coinStorage);
        this.coinService.coinBus$.next(new Coin(local));
      } else {
        // Start waarde aantal coins:
        this.coinService.coinBus$.next(new Coin(500));
      }

      /* ACHIEVEMENTS CHECK */
      const achievementStorage = window.localStorage.getItem('achievements');
      if (achievementStorage != undefined &&
        JSON.parse(achievementStorage).length > 0) {
        console.log('Opgeslagen achievements gevonden');
        let local = JSON.parse(achievementStorage);
        local = [...local];
        // of niet op bus en direct vervangen
        // ivm 'done' instelling?
        local.forEach(
          // doorloop de 'done achievements' die zijn opgeslagen
          (elem) => {
            this.achievementService.achievementBus$.next(elem.titel);
          }
        );
      }
    }
}
