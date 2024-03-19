import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar-dashboard',
  templateUrl: './calendar-dashboard.component.html',
  styleUrls: ['./calendar-dashboard.component.css']
})
export class CalendarDashboardComponent {
  selected: Date | null = new Date();
}
