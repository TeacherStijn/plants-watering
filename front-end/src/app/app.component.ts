import {AfterViewInit, Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {InventoryService} from "./shared/inventory.service";
import {SaveService} from "./shared/save.service";
import {ModalService} from './shared/modal.service';
import {StartImageComponent} from './startscreen/startimage.component';

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
    private inventoryService: InventoryService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.saveService.load();
    this.inventoryService.resetCursor();
    this.modalService.init(StartImageComponent, {}, { close: () => this.modalService.destroy() });
  }

  newGame() {
    const confirm = window.confirm('Wil je zeker overnieuw beginnen? Je verliest alle voortgang!');
    if (confirm === true) {
      this.saveService.new();
      alert('Ververs nu je pagina (<F5>)');
    }
  }

  saven() {
    if (this.saveService.checkUser()) {
      this.saveService.save();
      alert('Game saved!');
    } else {
      const confirm = window.confirm('Opslaan is mislukt. Wil je opnieuw inloggen?');
      if (confirm === true) {
        this.modalService.init(StartImageComponent, {}, {close: () => this.modalService.destroy()});
      }
    }
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

      video.onloadedmetadata = () => {
        // Set the canvas size to the video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame to the canvas when the video starts playing
        video.onplaying = () => {
          context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          const frame = canvas.toDataURL("image/png");
          captureStream.getTracks().forEach(track => track.stop());

          // Upload 'frame' somewhere
          console.log(frame);
          this.screen = frame;

          video.remove();
          canvas.remove();
        };

        // Start playing the video
        video.play();
      };
    } catch (err) {
      console.error("Error: " + err);
      video.remove();
      canvas.remove();
    }
  }
}
