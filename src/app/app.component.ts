import {Component, HostListener, OnInit} from '@angular/core';
import {InventoryService} from "./shared/inventory.service";
import {Item} from "./shared/models/item.model";
import {Plant} from "./shared/models/plant.model";
import {PlantenService} from "./shared/planten.service";

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
    private plantenService: PlantenService
  ) {}

  ngOnInit(): void {

  }

  @HostListener('window:unload', ['$event'])
  saven(ev) {
    window.localStorage.setItem('planten', JSON.stringify(this.plantenService.planten));
    window.localStorage.setItem('inventory', JSON.stringify(this.inventoryService.items));
    console.log(window.localStorage.getItem('planten'));
    console.log(window.localStorage.getItem('inventory'));
  }
}
