import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Achievement} from "./models/achievement.model";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AchievementService {
  achievementBus$: Subject<string>;
  achievements: Achievement[];

  constructor() {
    // Init van mogelijke achievements
    this.achievements = [
      new Achievement(1, 'And so it begins', false, 'First plant watered')
    ];

    this.achievementBus$ = new Subject<string>();
    this.achievementBus$.subscribe(
      (data) => {
        const found = this.achievements.find(
          (el) => {
            return el.titel === data;
          }
        );

        found.done = true;
      }
    );

    const achievementStorage = window.localStorage.getItem('achievements');
    if (achievementStorage != undefined &&
      JSON.parse(achievementStorage).length > 0) {
      console.log('Opgeslagen achievements gevonden');
      let local = JSON.parse(achievementStorage);
      local = [...local];
      // of niet op bus en direct vervangen
      // ivm 'done' instelling?
      local.forEach(
        // doorloop de 'done achievements' die zijn opgeslagen
        (elem) => {
          this.achievementBus$.next(elem.titel);
        }
      );
    }
  }

  get doneAchievements(): Achievement[] {
    return this.achievements.filter(
      (e) => {
        return e.done === true;
      }
    );
  }
}
