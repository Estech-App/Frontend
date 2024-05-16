import { ChangeDetectorRef, Component, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Calendar, CalendarOptions, DateInput, DateSelectArg, DurationInput, EventApi, EventClickArg, FormatterInput } from '@fullcalendar/core';
import { GroupDTO } from 'src/app/models/group/GroupDTO';
import { Room } from 'src/app/models/rooms/Room';
import { GroupService } from 'src/app/services/groups/group.service';
import { RoomService } from 'src/app/services/rooms/room.service';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { RoomTimeTable } from 'src/app/models/rooms/RoomTimeTable';
import { au } from '@fullcalendar/core/internal-common';
import { Dictionary } from '@fullcalendar/core/internal';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  form: FormGroup
  roomColumns: string[] = ["name", "group", "actions"]
  rooms: Room[] = []
  groups: GroupDTO[] = []
  selectedRoom: Room
  solicitudes: any[] = []
  solicitudesColumns = ["details", "actions"]

  @ViewChild('calendar') calendar!: Calendar

  calendarVisible = signal(true);
  currentEvents = signal<EventApi[]>([]);
  calendarOptions = signal<CalendarOptions>({
    timeZone: 'Europe/Madrid',
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'dayGridMonth',
    weekends: false,
    editable: true,
    selectable: true,
    selectMirror: true,
    locale: esLocale,
    dayMaxEvents: 2,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),

  });

  constructor(private formBuilder: FormBuilder, private roomService: RoomService, private groupService: GroupService, private changeDetector: ChangeDetectorRef) {

    this.form = this.formBuilder.group({
      id: '',
      name: '',
      mentoringRoom: null,
      studyRoom: null,
      groups: [],
      description: ''
    })

    this.selectedRoom = {
      id: null,
      name: '',
      description: '',
      mentoringRoom: false,
      studyRoom: false,
      groups: [{ id: null }],
      timeTables: []
    }

    this.solicitudes = [
      {
        name: "Vicente Pedraza",
        group: "DAM",
        date: "16-may",
        status: "pending"
      },
      {
        name: "Alberto Montavez",
        group: "DAM",
        date: "16-may",
        status: "pending"
      },
      {
        name: "Julian",
        group: "DAM",
        date: "16-may",
        status: "accepted"
      }
    ]
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getRooms()
    this.getGroups()

  }

  createRoom() {
    let room: Room = {
      id: this.form.get('id')?.value ?? '',
      name: this.form.get('name')?.value,
      mentoringRoom: this.form.get('mentoringRoom')?.value ?? false,
      studyRoom: this.form.get('studyRoom')?.value ?? false,
      groups: this.form.get('groups')?.value ?? 1,
      description: this.form.get('description')?.value,
      timeTables: this.transformCurrentEventsToTimeTable()
    }

    console.log(room)

    this.roomService.createRoom(room).subscribe({
      next: (room) => {
        this.rooms.push(room)
        this.form.reset()
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  transformCurrentEventsToTimeTable(): RoomTimeTable[] {
    let roomTimeTable: RoomTimeTable[] = []
    this.currentEvents().forEach((event) => {
      let id = ''
      let start = event.start?.toISOString()
      let end = event.end?.toISOString()
      let status = "OCCUPIED"
      let roomId = ''
      roomTimeTable.push({ id: id, start: start!, end: end!, status: status, roomId: roomId })
    });

    return roomTimeTable
  }

  getRooms() {
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms
        console.log(this.rooms)
      },
      error: (error) => {
        console.error(error)
      }
    })
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

  addRowToClicked(row: Room) {
    if (this.selectedRoom.id === row.id) {
      this.selectedRoom = {
        id: null,
        name: '',
        description: '',
        mentoringRoom: false,
        studyRoom: false,
        groups: [{ id: null }],
        timeTables: []
      }
    } else {
      this.selectedRoom = row
      console.log(row.groups);

      this.form.setValue({
        id: row.id,
        name: row.name,
        mentoringRoom: row.mentoringRoom,
        studyRoom: row.studyRoom,
        groups: row.groups ?? [],
        description: row.description
      })

      this.calendarOptions.set({
        ...this.calendarOptions(),
        events: this.toEventApi(row.timeTables).map(event => ({
          ...event,
          start: event.start ? event.start.toISOString() : undefined,
          end: event.end ? event.end.toISOString() : undefined
        }))
      })
    }
  }

  // * FullCalendar Methods

  toEventApi(timeTables: RoomTimeTable[]): EventApi[] {
    let events: EventApi[] = []
    timeTables.forEach((timeTable) => {
      events.push({
        id: timeTable.id!.toString(),
        title: timeTable.status,
        start: new Date(timeTable.start),
        end: new Date(timeTable.end),
        allDay: false,
        source: null,
        startStr: timeTable.start.split('T')[0],
        endStr: timeTable.end.split('T')[0],
        groupId: '',
        url: '',
        display: '',
        startEditable: false,
        durationEditable: false,
        constraint: undefined,
        overlap: false,
        allow: undefined,
        backgroundColor: '',
        borderColor: '',
        textColor: '',
        classNames: [],
        extendedProps: {},
        setProp: function (name: string, val: any): void {
          throw new Error('Function not implemented.');
        },
        setExtendedProp: function (name: string, val: any): void {
          throw new Error('Function not implemented.');
        },
        setStart: function (startInput: DateInput, options?: { granularity?: string | undefined; maintainDuration?: boolean | undefined; } | undefined): void {
          throw new Error('Function not implemented.');
        },
        setEnd: function (endInput: DateInput | null, options?: { granularity?: string | undefined; } | undefined): void {
          throw new Error('Function not implemented.');
        },
        setDates: function (startInput: DateInput, endInput: DateInput | null, options?: { allDay?: boolean | undefined; granularity?: string | undefined; } | undefined): void {
          throw new Error('Function not implemented.');
        },
        moveStart: function (deltaInput: DurationInput): void {
          throw new Error('Function not implemented.');
        },
        moveEnd: function (deltaInput: DurationInput): void {
          throw new Error('Function not implemented.');
        },
        moveDates: function (deltaInput: DurationInput): void {
          throw new Error('Function not implemented.');
        },
        setAllDay: function (allDay: boolean, options?: { maintainDuration?: boolean | undefined; } | undefined): void {
          throw new Error('Function not implemented.');
        },
        formatRange: function (formatInput: FormatterInput) {
          throw new Error('Function not implemented.');
        },
        remove: function (): void {
          throw new Error('Function not implemented.');
        },
        toPlainObject: function (settings?: { collapseExtendedProps?: boolean | undefined; collapseColor?: boolean | undefined; } | undefined): au {
          throw new Error('Function not implemented.');
        },
        toJSON: function (): au {
          throw new Error('Function not implemented.');
        }
      })
    })
    return events
  }

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
