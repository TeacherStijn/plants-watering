import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlantComponent } from './plant/plant.component';
import {FormsModule} from "@angular/forms";
import { InventoryComponent } from './inventory/inventory.component';
import { AchievementComponent } from './achievement/achievement.component';

@NgModule({
  declarations: [
    AppComponent,
    PlantComponent,
    InventoryComponent,
    AchievementComponent
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
