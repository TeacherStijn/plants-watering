import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ShopService} from "../shared/shop.service";
import {InventoryService} from "../shared/inventory.service";
import {Item} from "../shared/models/item.model";
import {CoinService} from "../shared/coin.service";
import {Gieter} from "../shared/models/gieter.model";
import {Rarity} from "../shared/models/rarity.model";
import {Grond} from "../shared/models/grond.model";
import {Schep} from "../shared/models/schep.model";
import {Plant, PlantNames} from "../shared/models/plant.model";
import {Seed} from "../shared/models/seed.model";
import {Coin} from "../shared/models/coin.model";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnChanges {

  sellItem: Item;
  soldItem: Item;
  constructor(private shopService: ShopService,
              private inventoryService: InventoryService,
              private coinService: CoinService) { }

  ngOnInit() {
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


      this.shopService.itemBus$.next(new Plant(PlantNames.CHAMOMILE, 1));
      this.shopService.itemBus$.next(new Plant(PlantNames.DANDELION, 1));
      const perm1 = new Seed(PlantNames.CHAMOMILE);
      perm1.shopPersistent = true;
      this.shopService.itemBus$.next(perm1);
      console.log(perm1.shopPersistent);
      this.shopService.itemBus$.next(new Seed(PlantNames.LAVENDER));
    }

    const coinStorage = window.localStorage.getItem('coins');
    if (coinStorage != undefined &&
      Number.parseInt(coinStorage) > 0) {
      console.log('Opgeslagen coins gevonden');
      const local = JSON.parse(coinStorage);
      this.coinService.coinBus$.next(new Coin(local));
    } else {
      this.coinService.coinBus$.next(new Coin(5));
    }
  }



  buy(item) {
    if (this.coinService.coins >= item.aankoopprijs) {
      const confirm = window.confirm(`Wil je ${ item.name } kopen voor ${item.aankoopprijs}?`);
      if (confirm === true) {
        const result = this.shopService.buy(item);
        alert(result);
      }
    } else {
      alert('Je hebt niet genoeg geld. Nodig: ' + item.aankoopprijs);
    }
  }

  preSell() {
    const item = this.inventoryService.currentActie;

    if (!(item instanceof Grond) &&
      !(item instanceof Gieter) &&
      !(item instanceof Schep)) {
      this.sellItem = item;
      console.log('Voorgestelde prijs: ' + this.sellItem.verkoopprijs);
    } else {
      alert('You can\'t sell this!');
      console.log('Type: ' + item.type);
    }
  }

  sell(ev) {
    /*Zorg ervoor dat hij niet denkt dat we
    wederom op het grijze 'ik wil iets verkopen' vlak klikken*/
    ev.stopPropagation();

    const item = this.inventoryService.currentActie;
    if (item !== undefined) {
      if (!(item instanceof Grond) &&
        !(item instanceof Gieter) &&
        !(item instanceof Schep)) {
        console.log('Probeer te verkopen: ' + item.type);
        this.shopService.sell(item);
        this.inventoryService.actieBus$.next(new Gieter(1, Rarity.COMMON));
        this.inventoryService.resetCursor();
        this.soldItem = item;
      }
    }

    this.sellItem = undefined;
  }

  cancelSell() {
    this.sellItem = undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // check of het om goldlings gaat;
    // dan sound afspelen
    if (changes.coinService) {
      const audio = new Audio('../assets/sell.wav');
      audio.play();
    }
  }
}
