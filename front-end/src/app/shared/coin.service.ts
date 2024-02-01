import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Coin} from "./models/coin.model";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CoinService {
  coins: number = 0;
  coinBus$: Subject<Coin>;

  constructor() {
    this.coinBus$ = new Subject<Coin>();
    this.coinBus$.subscribe(
      (data) => {
        this.coins += data.waarde;
      }
    );
  }

  getCoins(): number {
    return this.coins;
  }
}
