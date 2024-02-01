import { Component, OnInit } from '@angular/core';
import {AchievementService} from "../shared/achievement.service";

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css']
})
export class AchievementComponent implements OnInit {

  constructor(private achievementService: AchievementService) {

  }

  ngOnInit() {
    const achievementStorage = window.localStorage.getItem('achievements');
    if (achievementStorage != undefined &&
      JSON.parse(achievementStorage).length > 0) {
      // ophalen Inventory
      console.log('Opgeslagen data gevonden');
      let local = JSON.parse(achievementStorage);
      local = [...local];
      local.forEach(
        (elem) => {
          this.achievementService.achievementBus$.next(elem);
        }
      );
    } else {
      // geen achievements;
    }
  }

}
