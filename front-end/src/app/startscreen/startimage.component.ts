import {Component, EventEmitter, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SaveService} from '../shared/save.service';

@Component({
  template: `
    <div class="fullscreen-wrapper">
      <img src="../../assets/images/startscreen.png" class="fullscreen-image" (click)="close()"/>
      <form #startForm>
        <input type="text" #emailInput placeholder="Enter your e-mail address...">
        <input type="password" #apiKeyInput placeholder="Enter your gamekey...">
        <button id="loginButton" (click)="saveService.loginUser(emailInput.value, apiKeyInput.value)">Login</button>
        <button id="newButton" [disabled]="saveService.checkUser()" (click)="newGame()")>New game!</button>
        <button id="loadButton" [disabled]="saveService.checkUser()" (click)="loadGame()">Load</button>
      </form>
    </div>
  `,
  styles: [`
    .fullscreen-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: black; /* Optional: in case the image doesn't cover the whole screen */
      z-index: 1000; /* Make sure it's on top */
    }
    .fullscreen-image {
      width: 100%;
      height: 100%;
      object-fit: cover; /* This will ensure the image covers the whole screen */
    }
  `]
})
export class StartImageComponent {
  @Output() closeOff = new EventEmitter<void>();

  constructor (private http: HttpClient, private saveService: SaveService) {

  }

  newGame(): void {
    const confirm = window.confirm('Wil je zeker overnieuw beginnen? Je verliest alle eerder opgeslagen voortgang!');
    if (confirm === true) {
      this.saveService.new();

      const headers = new HttpHeaders({
        'content-type': 'application/json',
        'api-key': this.saveService.user.apiKey
      });
      this.http.post('http://localhost:9007/api/save', JSON.stringify({data: this.saveService.user.email, gameData: ''}), {headers})
        .subscribe(
          resp => {
            // Vervangen door SaveService
            this.saveService.new();
            this.closeOff.emit();
          },
          err => {
            console.error('Spel starten niet gelukt');
          }
        );
    }
  }

  loadGame(): void {
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'api-key': this.saveService.user.apiKey
    });
    this.http.post('http://localhost:9007/api/load', JSON.stringify({ data: this.saveService.user.email }), { headers })
      .subscribe(
        resp => {
          // Vervangen door SaveService
          this.saveService.load();
          this.closeOff.emit();
        },
        err => {
          console.error('Spel laden niet gelukt');
        }
      );
  }

  close() {
    this.closeOff.emit();
  }
}
