import { Component } from '@angular/core';
import { Group } from 'src/app/models/groups/Group';
import { GroupService } from 'src/app/services/groups/group.service';

@Component({
  selector: 'app-groups-dashboard',
  templateUrl: './groups-dashboard.component.html',
  styleUrls: ['./groups-dashboard.component.css']
})
export class GroupsDashboardComponent {
  displayedColumns = ['name', 'year', 'students', 'details']
  groups: Group[] = []

  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    this.getGroups()
  }

  getGroups() {
    this.groupService.getAllGroups().subscribe({
      next: (groups) => {
        this.groups = groups
      },
      error: (error) => {
        console.error(error)
      }
    })
  }
}
