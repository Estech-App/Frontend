import { Component } from '@angular/core';

@Component({
  selector: 'app-groups-dashboard',
  templateUrl: './groups-dashboard.component.html',
  styleUrls: ['./groups-dashboard.component.css']
})
export class GroupsDashboardComponent {
  displayedColumns = ['name', 'year', 'students', 'tutor', 'details']
  dataPlaceHolder = []
}
