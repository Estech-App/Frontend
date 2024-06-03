import { Component, ChangeDetectorRef, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/courses/Course';
import { Group } from 'src/app/models/groups/Group';
import { ModuleDTO } from 'src/app/models/module/ModuleDTO';
import { GroupService } from 'src/app/services/groups/group.service';
import { Calendar, CalendarOptions, DateInput, DateSelectArg, DurationInput, EventApi, EventClickArg, FormatterInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { ModuleService } from 'src/app/services/module/module.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent {

  groups: Group[] = []
  modules: ModuleDTO[] = []
  courses: Course[] = []
  displayedColumns = ['name', 'description', 'year']
  form: FormGroup

  post = true

  // selectedGroup: Group

  currentEvents = signal<EventApi[]>([]);
  calendarOptions = signal<CalendarOptions>({
    timeZone: 'Europe/Madrid',
    views: {
      morning: {
        type: 'timeGrid',
        duration: { days: 5 },
        buttonText: 'Mañana',
        slotDuration: '00:30:00',
        slotLabelInterval: '00:10:00',
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: false, meridiem: 'short' },
        slotMinTime: '08:30:00',
        slotMaxTime: '15:00:00',
        allDaySlot: false,
        expandRows: true
      }
    },
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'morning'
    },
    initialView: 'morning',
    weekends: false,
    editable: true,
    selectable: true,
    selectMirror: true,
    locale: esLocale,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),

  });

  constructor(
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private moduleService: ModuleService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.getAllGroups()
    this.form = this.formBuilder.group({
      id: '',
      name: '',
      description: ''
    })
    // this.selectedGroup = {
    //   id: null,
    //   name: '',
    //   description: '',
    //   year: null,
    //   users: [{ id: 0 }],
    //   files: [{ id: 0 }],
    //   course: { id: 0 },
    //   timeTables: [{ id: 0 }],
    //   room: null
    // }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getModules()
  }

  getAllGroups() {
    this.groupService.getAllGroups().subscribe({
      next: res => {
        this.groups = res
      }, error: err => {
        console.log(err);
      }
    })

  }

  createNewGroup(): void {
    let group: Group = {
      id: null,
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      year: this.form.get('year')?.value,
      roomId: this.form.get('roomId')?.value,
      courseId: this.form.get('courseId')?.value,
      users: [],
    }
  }

  getGroupById(id: number) {

  }

  updateGroup() { }

  // * Modules Methods
  getModules() {
    this.moduleService.getAllModules().subscribe({
      next: res => {
        this.modules = res
      }, error: err => {
        console.log(err);
      }
    })
  }

  // * FullCalendar Methods

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = "Ocupado"
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection
    console.log(selectInfo)

    if (title) {
      calendarApi.addEvent({
        id: '',
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  

}
