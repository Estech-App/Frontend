import { Component, ChangeDetectorRef, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/courses/Course';
import { Group } from 'src/app/models/groups/Group';
import { ModuleDTO } from 'src/app/models/module/ModuleDTO';
import { GroupService } from 'src/app/services/groups/group.service';
import { Calendar, CalendarOptions, DateInput, DateSelectArg, DurationInput, EventApi, EventClickArg, EventDropArg, FormatterInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { ModuleService } from 'src/app/services/module/module.service';
import { CourseService } from 'src/app/services/courses/course.service';

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

  @ViewChild('calendar') calendar!: any;
  @ViewChild('cardList', { static: true }) cardList!: any

  // selectedGroup: Group

  currentEvents = signal<EventApi[]>([]);
  calendarOptions = signal<CalendarOptions>({
    timeZone: 'Europe/Madrid',
    views: {
      morning: {
        type: 'timeGrid',
        duration: { week: 1 },
        buttonText: 'Mañana',
        slotDuration: '00:10:00',
        slotLabelInterval: '01:50:00',
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: false, meridiem: 'short' },
        slotMinTime: '08:30:00',
        slotMaxTime: '14:30:00',
        allDaySlot: false,
        expandRows: true,

      },
      afternoon: {
        type: 'timeGrid',
        duration: { week: 1 },
        buttonText: 'Tarde',
        slotDuration: '00:10:00',
        slotLabelInterval: '01:50:00',
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: false, meridiem: 'short' },
        slotMinTime: '15:30:00',
        slotMaxTime: '21:30:00',
        allDaySlot: false,
        expandRows: true,
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
    selectMirror: true,
    businessHours: [
      {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '8:30',
        endTime: '10:20'
      },
      {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '10:40',
        endTime: '12:30'
      },
      {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '12:40',
        endTime: '14:30'
      },
      {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '15:30',
        endTime: '17:20'
      },
      {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '17:40',
        endTime: '19:30'
      },
      {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '19:40',
        endTime: '21:30'
      }
    ],
    dropAccept: '.module-card',
    locale: esLocale,
    eventOverlap: false,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventReceive: function (info) {
      console.log(info)
    }
  });

  constructor(
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private moduleService: ModuleService,
    private courseService: CourseService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.form = this.formBuilder.group({
      id: '',
      year: '',
      modules: [],
      courses: [],
      schedule: []
    })


  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllGroups()
    this.getModules()
    this.getCourses()

    console.log(this.cardList.nativeElement)

    new Draggable(this.cardList.nativeElement, {
      itemSelector: '.module-card',
      eventData: function (eventEl) {
        console.log(eventEl)
        return {
          title: eventEl.innerText,
          duration: '01:50:00',
          backgroundColor: eventEl.style.backgroundColor,
          textColor: 'black'
        }
      }
    })
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

  // * Courses Methods
  getCourses() {
    this.courseService.getAllCourses().subscribe({
      next: res => {
        this.courses = res
      }, error: err => {
        console.log(err);
      }
    })
  }

  // * FullCalendar Methods

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  handleEventDrop(event: EventDropArg) {
    console.log(event)
  }

  // * Form Methods
  
  changeCalendarView() {
    let radio = this.form.get('schedule')?.value
    if (radio == '1') {
      this.calendarOptions.set({
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'morning'
        }
      })
      this.calendar.calendar.changeView('morning')
    } else if (radio == '2') {
      this.calendarOptions.set({
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'afternoon'
        }
      })
      this.calendar.calendar.changeView('afternoon')
    } 
  }



}
