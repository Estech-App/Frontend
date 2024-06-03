import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { Group } from 'src/app/models/groups/Group';
import { User } from 'src/app/models/users/User';

import DayGridPlugin  from '@fullcalendar/daygrid';
import TimeGridPlugin  from '@fullcalendar/timegrid';
import InteractionPlugin  from '@fullcalendar/interaction';
@Component({
  selector: 'app-groups-details',
  templateUrl: './groups-details.component.html',
  styleUrls: ['./groups-details.component.css']
})
export class GroupsDetailsComponent {
  group: Group[] = []
  groupTableColumns: string[] = ['name', 'modules']

  students: User[] = []
  studentsTableColumns: string[] = ['name', 'mentoringsCount', 'lastMentoring', 'freeUsagesCount']

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [DayGridPlugin, TimeGridPlugin, InteractionPlugin],
  }
}
