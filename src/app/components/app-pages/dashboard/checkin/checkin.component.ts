import { Component } from '@angular/core';
import { Checkin } from 'src/app/models/checkin/Checkin';
import { CheckinDTO } from 'src/app/models/checkin/CheckinDTO';
import { CheckinService } from 'src/app/services/checkin/checkin.service';
import { MainComponent } from '../../main/main.component';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent {

  date: string = '';
  hour: string = ''
  checkins: CheckinDTO[] = []
  lastFourCheckins: CheckinDTO[] = []
  displayedColumns: string[] = ['date', 'time', 'checkin', 'icon'];

  ngOnInit() {
    this.getCheckins()
  }

  constructor(private checkinService: CheckinService) {
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

  checkin() {
    let checkin: Checkin = {
      date: Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()).toString(),
      user: {
        id: sessionStorage.getItem('userId') != null ? sessionStorage.getItem('userId')! : ''
      },
      checkIn: this.checkinStatus(this.lastFourCheckins[0])
    }
    this.checkinService.checkin(checkin).subscribe({
      next: res => {
        let tmp: CheckinDTO = {
          date: res.date,
          userId: Number(res.user.id),
          checkIn: res.checkIn
          
        }
        this.checkins = [];
        this.checkins.push(tmp);
        this.getCheckins()
        print
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getCheckins() {
    this.checkinService.getCheckIn().subscribe({
      next: res => {
        this.checkins = res;
        console.log(this.checkins);
        this.lastFourCheckins = [];
        this.getLastFourCheckinsOfUser(this.checkins)
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getLastFourCheckinsOfUser(arr: CheckinDTO[]) {
    this.lastFourCheckins = arr.filter((checkin) => {
      return checkin.userId === Number(sessionStorage.getItem('userId'));
    }).slice(-4);
    this.lastFourCheckins = this.lastFourCheckins.reverse();
  }

  checkinStatus(checkin: CheckinDTO) {
    return checkin.checkIn ? false : true;
  }


}
