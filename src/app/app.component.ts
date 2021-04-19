import {Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {InventoryService} from "./shared/inventory.service";
import {Item} from "./shared/models/item.model";
import {Plant} from "./shared/models/plant.model";
import {PlantenService} from "./shared/planten.service";
import {ShopService} from "./shared/shop.service";
import {CoinService} from "./shared/coin.service";
import {AchievementService} from "./shared/achievement.service";
import {SaveService} from "./shared/save.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  action: string = 'gieter';
  screen: string;

  /*planten: Plant[] = [];
  inventory: Item[] = [];
*/

  constructor(
    private saveService: SaveService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.saveService.load();
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
    this.saveService.save();
    alert('Game saved!');
  }

  async screenshot() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = document.createElement("video");

    try {
      console.log("Capturen!");
      // @ts-ignore
      const captureStream = await navigator.mediaDevices.getDisplayMedia();
      video.srcObject = captureStream;
      context.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);

      // is PNG juiste type?
      const frame = canvas.toDataURL("image/png");
      captureStream.getTracks().forEach(track => track.stop());

      // hier dus 'frame' uploaden ergens naartoe?
      // of popup??
      console.log(frame);
      this.screen = frame;
    } catch (err) {
      console.error("Error: " + err);
    }
  }
}
