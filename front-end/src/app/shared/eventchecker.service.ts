import {Injectable} from "@angular/core";
import {DagEvent} from "./models/dagevent.model";
import {PlantenService} from "./planten.service";
import {SaveService} from "./save.service";
import {Artifact} from "./models/artifact.model";
import {Rarity} from "./models/rarity.model";
import {InventoryService} from "./inventory.service";
import {Coin} from "./models/coin.model";

@Injectable({
  providedIn: 'root'
})
export class EventCheckerService {
  events: DagEvent[] = [];

  constructor(private plantenService: PlantenService,
              private inventoryService: InventoryService) {
  }

  tileEvent(aantalX, aantalY): any {
    const random = Math.floor(Math.random() * 10) + 1;
    if (random === 10) {
      console.log('Random event getal: ' + random);
      const randomArtifact = new Artifact();

      return {
        item: randomArtifact,
        x: Math.floor(Math.random() * aantalX),
        y: Math.floor(Math.random() * aantalY),
      };
    } else {
      return false;
    }
  }

  randomEvent(rarity: Rarity): any {
    const RANDOM_EVENT_NR = Math.floor(Math.random() * 2);
    let reeksEvents;

    switch (rarity) {
      case Rarity.COMMON:
        reeksEvents = [];
        this.inventoryService.inventoryBus$.next(new Coin(20));
        console.log('20 muntjes erbij!');
        break;
      case Rarity.UNCOMMON:
        reeksEvents = [];
        this.inventoryService.inventoryBus$.next(new Coin(50));
        console.log('50 muntjes erbij!');
        break;
      case Rarity.RARE:
        reeksEvents = [];
        this.inventoryService.inventoryBus$.next(new Coin(100));
        console.log('100 muntjes erbij!');
        break;
      case Rarity.EPIC:
        reeksEvents = [];
        this.inventoryService.inventoryBus$.next(new Coin(250));
        console.log('250 muntjes erbij!');
        break;
      case Rarity.LEGENDARY:
        reeksEvents = [];
        this.inventoryService.inventoryBus$.next(new Coin(500));
        console.log('500 muntjes erbij!');
        break;
    }
  }
}
