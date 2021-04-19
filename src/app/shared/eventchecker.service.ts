import {Injectable} from "@angular/core";
import {DagEvent} from "./models/dagevent.model";
import {PlantenService} from "./planten.service";
import {SaveService} from "./save.service";
import {SpecialGrond} from "./models/specialgrond.model";
import {Item} from "./models/item.model";
import {Grond} from "./models/grond.model";

@Injectable({
  providedIn: 'root'
})
export class EventCheckerService {
  events: DagEvent[] = [];

  constructor(private plantenService: PlantenService,
              private saveService: SaveService) {
    // this.events.push();
  }

  randomEvent(): any {
    const random = Math.floor(Math.random() * 10) + 1;
    if (random === 10) {
      // Hier dus ITEMPOOL uit service halen?
      const randomItem = new Item();

      return {
        item: randomItem,
        x: Math.floor(Math.random() * this.saveService.aantalX),
        y: Math.floor(Math.random() * this.saveService.aantalY),
      };
    } else {
      return false;
    }
  }
}
