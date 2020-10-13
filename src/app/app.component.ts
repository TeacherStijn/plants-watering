import {Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {InventoryService} from "./shared/inventory.service";
import {Item} from "./shared/models/item.model";
import {Plant} from "./shared/models/plant.model";
import {PlantenService} from "./shared/planten.service";
import {ShopService} from "./shared/shop.service";
import {CoinService} from "./shared/coin.service";
import {AchievementService} from "./shared/achievement.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  action: string = 'gieter';

  planten: Plant[] = [];
  inventory: Item[] = [];

  constructor(
    private inventoryService: InventoryService,
    private plantenService: PlantenService,
    private shopService: ShopService,
    private achievementService: AchievementService,
    private coinService: CoinService
  ) {}

  ngOnInit(): void {
    this.inventoryService.resetCursor();
  }

  newGame() {
    const confirm = window.confirm("Wil je zeker overnieuw beginnen? Je verliest alle voortgang!");
    if (confirm === true) {
      window.localStorage.clear();
      alert('Ververs nu je pagina (<F5>)');
    }
  }

  saven(ev) {
    window.localStorage.setItem('planten', JSON.stringify(this.plantenService.planten));
    window.localStorage.setItem('inventory', JSON.stringify(this.inventoryService.items));
    window.localStorage.setItem('shop', JSON.stringify(this.shopService.items));
    window.localStorage.setItem('achievements', JSON.stringify(this.achievementService.doneAchievements))
    window.localStorage.setItem('coins', JSON.stringify(this.coinService.coins));
    alert('Game saved!');
  }
}
