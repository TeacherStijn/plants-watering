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
    if (window.localStorage.getItem('achievements') != undefined &&
      !(JSON.parse(window.localStorage.getItem('achievements')) instanceof Array)) {
      // ophalen Inventory
      console.log('Opgeslagen data gevonden');
      let local = JSON.parse(window.localStorage.getItem('achievements'));
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
