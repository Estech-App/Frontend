import { Component } from '@angular/core';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent {

  date: string = '';
  hour: string = ''
  checkins: any[] = []

  constructor() {
    this.updateCurrentHour();
      this.updateCurrentDate();
    setInterval(() => {
      this.updateCurrentHour();
      this.updateCurrentDate();
    }, 1000);
  }

  updateCurrentHour() {
    let seconds = new Date().getSeconds();
    if (seconds < 10) {
      this.hour = `${new Date().getHours()}:${new Date().getMinutes()}:0${new Date().getSeconds()}`;
      return;
    }
    this.hour = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
  }

  updateCurrentDate() {
    this.date = `${new Date().toLocaleDateString()}`;
  }

}
