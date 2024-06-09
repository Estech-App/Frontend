import { Component, ChangeDetectorRef, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/courses/Course';
import { Group } from 'src/app/models/groups/Group';
import { ModuleDTO } from 'src/app/models/module/ModuleDTO';
import { GroupService } from 'src/app/services/groups/group.service';
import { CalendarOptions, EventApi, EventClickArg, EventDropArg, EventInput, } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { ModuleService } from 'src/app/services/module/module.service';
import { CourseService } from 'src/app/services/courses/course.service';
import { TimeTable } from 'src/app/models/groups/TimeTable';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent {

  groups: MatTableDataSource<Group> = new MatTableDataSource<Group>([]);
  selectedGroup: Group
  modules: ModuleDTO[] = []
  selectedModules: ModuleDTO[] = []
  courses: Course[] = []
  displayedColumns = ['name', 'description', 'year']
  form: FormGroup

  post = true

  @ViewChild('calendar') calendar!: any;
  @ViewChild('cardList', { static: true }) cardList!: any

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
      left: '',
      center: '',
      right: ''
    },
    initialView: 'morning',
    weekends: false,
    editable: true,
    selectMirror: true,
    dayHeaderContent: (args) => {
      switch (args.date.getDay()) {
        case 1:
          return 'Lunes'
        case 2:
          return 'Martes'
        case 3:
          return 'Miércoles'
        case 4:
          return 'Jueves'
        case 5:
          return 'Viernes'
        default:
          return ''
      }
    },
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
  })

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
      course: null,
      evening: null,
    })

    this.selectedGroup = {
      id: null,
      name: '',
      description: '',
      year: '',
      roomId: null,
      courseId: null,
      users: [],
      timeTables: [],
      evening: false
    }

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllGroups()
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
        this.groups.data = res
      }, error: err => {
        console.log(err);
      }
    })

  }

  createNewGroup(): void {

    let group: Group = {
      id: null,
      name: this.form.get('course')?.value.name + ' ' + this.form.get('year')?.value,
      description: this.form.get('description')?.value,
      year: this.form.get('year')?.value,
      roomId: this.form.get('roomId')?.value,
      courseId: this.form.get('course')?.value.id,
      users: this.form.get('users')?.value,
      timeTables: this.transformCurrentEventsToTimeTable(),
      evening: this.form.get('evening')?.value === '1' ? true : false
    }

    console.log(group)

    this.groupService.createNewGroup(group).subscribe({
      next: res => {
        console.log(res)
        this.form.reset()
        this.getAllGroups()
        this.calendar.calendar.removeAllEvents()
        this.selectedModules = []
      }, error: err => {
        console.log(err)
      }
    })
  }

  getGroupById(id: number) {

  }

  updateGroup() {
    let group: Group = {
      id: this.form.get('id')?.value,
      name: this.form.get('course')?.value.name + ' ' + this.form.get('year')?.value,
      description: this.form.get('description')?.value,
      year: this.form.get('year')?.value,
      roomId: this.form.get('roomId')?.value,
      courseId: this.form.get('course')?.value.id,
      users: this.form.get('users')?.value,
      timeTables: this.transformCurrentEventsToTimeTable(),
      evening: this.form.get('evening')?.value === '1' ? true : false
    }

    group.timeTables.forEach((timeTable: TimeTable) => {
      if (timeTable.id === '') {
        timeTable.id = null
      }
    })

    console.log(group)

    this.groupService.updateGroup(group).subscribe({
      next: res => {
        console.log(res)
        this.form.reset()
        this.getAllGroups()
        this.calendar.calendar.removeAllEvents()
        this.selectedModules = []
        this.selectedGroup = {
          id: null,
          name: '',
          description: '',
          year: '',
          roomId: null,
          courseId: null,
          users: [],
          timeTables: [],
          evening: false
        }
      }, error: err => {
        console.log(err)
      }
    })
  }

  addRowToClicked(row: Group) {
    if (this.selectedGroup.id === row.id) {
      this.selectedGroup = {
        id: null,
        name: '',
        description: '',
        year: '',
        roomId: null,
        courseId: null,
        users: [],
        timeTables: [],
        evening: false
      }
      this.form.reset()
      this.calendar.calendar.removeAllEvents()
      this.post = true
      this.selectedModules = []
    } else {
      this.post = false
      this.selectedGroup = row

      if (row.courseId !== null) {
        this.moduleService.getModulesByCourseId(row.courseId).subscribe({
          next: res => {
            this.modules = res
            this.form.setValue({
              id: row.id,
              year: row.year,
              modules: row.timeTables.map(timeTable => this.modules.find(module => module.id === timeTable.moduleId)),
              course: this.courses.find(course => course.id === row.courseId),
              evening: row.evening ? '1' : '0'
            })

            this.selectedModules = row.timeTables.map(timeTable => this.modules.find(module => module.id === timeTable.moduleId)).filter(module => module !== undefined) as ModuleDTO[];

            row.timeTables.forEach((event: any) => {
              event.color = this.modules.find(module => module.id === event.moduleId)?.color
              let startString: Date = new Date(event.start)
              event.startTime = startString.toTimeString()
              let endString: Date = new Date(event.end)
              event.endTime = endString.toTimeString()
              event.startRecur = event.startStr
              event.daysOfWeek = [event.weekday]
              event.title = this.modules.find(module => module.id === event.moduleId)?.acronym + '\n' + this.modules.find(module => module.id === event.moduleId)?.usersName
              event.textColor = 'black'
              console.log(event)
              this.calendar.calendar.addEvent(event)
            })
            console.log(this.calendar.calendar.getEvents())
          }, error: err => {
            console.log(err);
          }
        })
      }
    }
  }

  // * Modules Methods
  getModulesByCourseId(courseId: any) {
    this.moduleService.getModulesByCourseId(courseId).subscribe({
      next: res => {
        this.modules = res
      }, error: err => {
        console.log(err);
      }
    })
  }

  addModuleToSelectedModules(module: ModuleDTO[]) {
    this.selectedModules = []
    this.selectedModules = module
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

  handleEventDrop(event: EventInput) {

  }

  transformCurrentEventsToTimeTable(): TimeTable[] {
    let timeTables: TimeTable[] = []
    let calendarEvents = this.calendar.calendar.getEvents()
    let modules = this.form.get('modules')?.value

    calendarEvents.forEach((event: any) => {
      let id = event.id
      console.log(event.title)
      console.log(modules[0].name)
      let start = event.start?.toISOString()
      let end = event.end?.toISOString()
      let schoolGroupId = this.form.get('id')?.value
      let moduleId = modules.find((module: ModuleDTO) => module.acronym === event.title.split('\n')[0])?.id
      let weekday = event.start?.getDay().toString()

      timeTables.push({ id, start, end, schoolGroupId, moduleId, weekday })
    });

    return timeTables
  }

  // * Form Methods
  changeCalendarView() {
    let radio = this.form.get('evening')?.value
    if (radio == '0') {
      this.calendarOptions.set({
        headerToolbar: {
          left: 'prev,next',
          center: '',
          right: ''
        }
      })
      this.calendar.calendar.changeView('morning')
    } else if (radio == '1') {
      this.calendarOptions.set({
        headerToolbar: {
          left: 'prev,next',
          center: '',
          right: ''
        }
      })
      this.calendar.calendar.changeView('afternoon')
    }
  }
}
