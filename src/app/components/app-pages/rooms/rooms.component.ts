import { ChangeDetectorRef, Component, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Calendar, CalendarOptions, DateInput, DateSelectArg, DurationInput, EventApi, EventClickArg, FormatterInput } from '@fullcalendar/core';
import { Room } from 'src/app/models/rooms/Room';
import { RoomService } from 'src/app/services/rooms/room.service';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { RoomTimeTable } from 'src/app/models/rooms/RoomTimeTable';
import { au } from '@fullcalendar/core/internal-common';
import { MatTableDataSource } from '@angular/material/table';
import { FreeUsageService } from 'src/app/services/freeUsages/free-usage.service';
import { FreeUsage } from 'src/app/models/freeUsages/freeUsage';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  form: FormGroup
  roomColumns: string[] = ["name", "actions"]
  rooms: MatTableDataSource<Room> = new MatTableDataSource<Room>()
  selectedRoom: Room
  freeUsages: MatTableDataSource<FreeUsage> = new MatTableDataSource<FreeUsage>()
  gestionedFreeUsages: MatTableDataSource<FreeUsage> = new MatTableDataSource<FreeUsage>()
  solicitudesColumns = ["details", "actions"]
  post = true

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

  constructor(private formBuilder: FormBuilder, private roomService: RoomService, private freeUsageService: FreeUsageService, private changeDetector: ChangeDetectorRef) {

    this.form = this.formBuilder.group({
      id: '',
      name: '',
      mentoringRoom: null,
      studyRoom: null,
      description: ''
    })

    this.selectedRoom = {
      id: null,
      name: '',
      description: '',
      mentoringRoom: false,
      studyRoom: false,
      timeTables: []
    }
  }

  ngOnInit(): void {
    this.getRooms()
    this.getFreeUsages()
  }

  createRoom() {
    let room: Room = {
      id: this.form.get('id')?.value ?? '',
      name: this.form.get('name')?.value,
      mentoringRoom: this.form.get('mentoringRoom')?.value ?? false,
      studyRoom: this.form.get('studyRoom')?.value ?? false,
      description: this.form.get('description')?.value,
      timeTables: this.transformCurrentEventsToTimeTable()
    }
    console.log("Create Room")
    console.log(room)

    this.roomService.createRoom(room).subscribe({
      next: (room) => {
        this.rooms.data.push(room)
        this.form.reset()
        this.getRooms()
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  updateRoom() {
    let room: Room = {
      id: this.form.get('id')?.value ?? '',
      name: this.form.get('name')?.value,
      mentoringRoom: this.form.get('mentoringRoom')?.value ?? false,
      studyRoom: this.form.get('studyRoom')?.value ?? false,
      description: this.form.get('description')?.value,
      timeTables: this.transformCurrentEventsToTimeTable()
    }
    console.log("Update Room")

    console.log(room)

    this.roomService.updateRoom(room).subscribe({
      next: (room) => {
        this.rooms.data = this.rooms.data.map((r) => r.id === room.id ? room : r)
        this.post = true
        this.form.reset()
        this.getRooms()
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  getRooms() {
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms.data = rooms
        console.log(this.rooms)
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
        timeTables: []
      }
      this.form.reset()
      this.calendarOptions.set({ ...this.calendarOptions(), events: [] })
      this.post = true
	  // ! Fernando - New Code not working:
	  // Should be displaying all existing free usages
	  this.freeUsageService.getFreeUsages().subscribe({
		next: (freeUsages) => {
			this.freeUsages.data = freeUsages
			this.gestionedFreeUsages.data = this.freeUsages.data.filter(fu => fu.status !== "PENDING")
		},
		error: (error) => {
			console.error(error)
		}
	  })
    } else {
      this.post = false
      this.selectedRoom = row
      console.log(row);

      this.form.setValue({
        id: row.id,
        name: row.name,
        mentoringRoom: row.mentoringRoom,
        studyRoom: row.studyRoom,
        description: row.description
      })

	  // ! Fernando - New Code not working:
	  // Should be displaying selected room free usages.
	  this.freeUsageService.getFreeUsagesByRoomId(row.id!).subscribe({
		next: (freeUsages) => {
			this.freeUsages.data = freeUsages
			this.gestionedFreeUsages.data = this.freeUsages.data.filter(fu => fu.status !== "PENDING")
		},
		error: (error) => {
			console.error(error)
		}
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

  // * Free Usage Methods
  getFreeUsages() {
    this.freeUsageService.getFreeUsages().subscribe({
      next: (freeUsages) => {
        this.freeUsages.data = freeUsages
        this.gestionedFreeUsages.data = this.freeUsages.data.filter(fu => fu.status !== "PENDING")
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  updateFreeUsage(freeUsage: FreeUsage, status: boolean) {
    console.log(freeUsage);
    freeUsage.status = status ? "APPROVED" : "DENIED"
    console.log(freeUsage);
    this.freeUsageService.updateFreeUsage(freeUsage).subscribe({
      next: (freeUsage) => {
        this.freeUsages.data = this.freeUsages.data.map((fu) => fu.id === freeUsage.id ? freeUsage : fu)
        this.getFreeUsages()
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  createFreeUsage(freeUsage: FreeUsage) {
    freeUsage.status = "PENDING"
    this.freeUsageService.createFreeUsage(freeUsage).subscribe({
      next: (freeUsage) => {
        this.freeUsages.data.push(freeUsage)
      },
      error: (error) => {
        console.error(error)
      }
    })
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
}
