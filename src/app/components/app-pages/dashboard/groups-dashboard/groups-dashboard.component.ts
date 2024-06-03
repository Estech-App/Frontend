import { Component } from '@angular/core';
import { GroupDTO } from 'src/app/models/group/GroupDTO';
import { GroupService } from 'src/app/services/groups/group.service';

@Component({
  selector: 'app-groups-dashboard',
  templateUrl: './groups-dashboard.component.html',
  styleUrls: ['./groups-dashboard.component.css']
})
export class GroupsDashboardComponent {
  displayedColumns = ['name', 'year', 'students', 'details']
  groups: GroupDTO[] = []

  constructor(private groupService: GroupService) {
    this.getGroups()
  }

  getGroups() {
    this.groupService.getGroups().subscribe({
      next: (groups) => {
        this.groups = groups
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

}
