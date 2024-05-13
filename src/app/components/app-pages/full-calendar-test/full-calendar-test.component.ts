import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import { Checkin } from 'src/app/models/checkin/Checkin';
import { CheckinDTO } from 'src/app/models/checkin/CheckinDTO';
import { CheckinService } from 'src/app/services/checkin/checkin.service';

@Component({
  selector: 'app-full-calendar-test',
  templateUrl: './full-calendar-test.component.html',
  styleUrls: ['./full-calendar-test.component.css']
})
export class FullCalendarTestComponent {
  checkins: CheckinDTO[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    weekends: false,
    views: {
      timeGridWeek: {
        slotMinTime: '08:30:00',
        slotMaxTime: '22:00:00',
        slotMinuts: 30,
        slotDuration: '00:30:00',
        slotLabelInterval: '00:30:00',
        titleFormat: {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
          weekday: 'long'
        },
      }
    },
    eventDisplay: 'auto'
  };

  constructor(private checkinService: CheckinService) {
    this.getCheckins();
  }

  getCheckins() {
    this.checkinService.getCheckIn().subscribe({
      next: (data) => {
        this.checkins = data;
        this.calendarOptions.events = this.checkins.map((checkin) => {
          return {
            title: checkin.user,
            start: checkin.date
          }
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
