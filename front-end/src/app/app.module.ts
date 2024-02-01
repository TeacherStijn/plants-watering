import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlantComponent } from './plant/plant.component';
import {FormsModule} from "@angular/forms";
import { InventoryComponent } from './inventory/inventory.component';
import { AchievementComponent } from './achievement/achievement.component';
import { ShopComponent } from './shop/shop.component';
import {SellComponent} from "./shop/sell.component";
import {BuyComponent} from "./shop/buy.component";
import {StartImageComponent} from './startscreen/startimage.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    StartImageComponent,
    AppComponent,
    PlantComponent,
    InventoryComponent,
    AchievementComponent,
    ShopComponent,
    SellComponent,
    BuyComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule
  ],
  providers: [],
  /*
    The entryComponents is used to define the components
    that are not found in html initially and that are
    created dynamically with ComponentFactoryResolver.
    In order for angular to compile,
    it needs this hint in the module.
    Since our xxxComponent will be dynamically added
    to the DOM, we need to mention it in the
    NgModule decorator.
   */
  entryComponents: [StartImageComponent, SellComponent, BuyComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
