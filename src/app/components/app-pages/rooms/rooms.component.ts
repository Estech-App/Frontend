import { ChangeDetectorRef, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Calendar, CalendarApi, CalendarOptions, DateInput, DateSelectArg, DurationInput, EventApi, EventClickArg, EventInput, FormatterInput } from '@fullcalendar/core';
import { Room } from 'src/app/models/rooms/Room';
import { RoomService } from 'src/app/services/rooms/room.service';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { RoomTimeTable } from 'src/app/models/rooms/RoomTimeTable';
import { au, co } from '@fullcalendar/core/internal-common';
import { MatTableDataSource } from '@angular/material/table';
import { FreeUsageService } from 'src/app/services/freeUsages/free-usage.service';
import { FreeUsage } from 'src/app/models/freeUsages/freeUsage';
import { Mentoring } from 'src/app/models/mentorings/Mentoring';
import { MentoringService } from 'src/app/services/mentorings/mentoring.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  form: FormGroup
  reccurenceForm: FormGroup
  roomColumns: string[] = ["name", "actions"]
  rooms: MatTableDataSource<Room> = new MatTableDataSource<Room>()
  selectedRoom: Room
  freeUsages: FreeUsage[] = []
  mentorings: Mentoring[] = []
  gestionedFreeUsages: MatTableDataSource<FreeUsage> = new MatTableDataSource<FreeUsage>()
  pendingFreeUsages: MatTableDataSource<FreeUsage> = new MatTableDataSource<FreeUsage>()
  solicitudesColumns = ["details", "actions"]
  post = true

  @ViewChild('calendar') calendar!: Calendar;

  calendarVisible = signal(true);
  currentEvents = signal<EventApi[]>([]);
  calendarOptions = signal<CalendarOptions>({
    timeZone: 'local',
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

  constructor(private formBuilder: FormBuilder, private roomService: RoomService, private freeUsageService: FreeUsageService, private mentoringService: MentoringService, private changeDetector: ChangeDetectorRef) {

    this.form = this.formBuilder.group({
      id: '',
      name: '',
      mentoringRoom: null,
      studyRoom: null,
      description: ''
    })

    this.reccurenceForm = this.formBuilder.group({
      recurrToggle: false
    })

    this.selectedRoom = {
      id: null,
      name: '',
      description: '',
      mentoringRoom: false,
      studyRoom: false,
      timeTables: []
    }

    console.log(this.calendar)
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.getRooms()
    this.getFreeUsages()
    this.getMentorings()
    console.log(this.calendar)
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

      this.getFreeUsages()
      this.getMentorings()
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

      this.freeUsageService.getFreeUsagesByRoomId(row.id ?? 0).subscribe({
        next: (freeUsages) => {
          console.log(freeUsages);
          this.freeUsages = freeUsages;
          this.gestionedFreeUsages.data = this.freeUsages.filter(fu => fu.status !== "PENDING");
          this.pendingFreeUsages.data = this.freeUsages.filter(fu => fu.status === "PENDING");

          this.mentoringService.getMentoringsByRoomId(row.id ?? 0).subscribe({
            next: (mentorings) => {
              this.mentorings = mentorings;

              this.calendarOptions.set({
                ...this.calendarOptions(),
                events: this.toEventApi(row.timeTables).map(event => ({
                  ...event,
                  id: event.id,
                  extendedProps: { roomId: row.id },
                  title: event.title,
                  start: event.start?.toString(),
                  end: event.end?.toString()
                })).concat(this.toEventApi(this.freeUsages).map(event => ({
                  ...event,
                  id: '',
                  extendedProps: { roomId: row.id },
                  title: event.title,
                  start: event.start?.toString(),
                  end: event.end?.toString()
                }))).concat(this.toEventApi(this.mentorings).map(event => ({
                  ...event,
                  id: '',
                  extendedProps: { roomId: row.id },
                  title: event.title,
                  start: event.start?.toString(),
                  end: event.end?.toString()
                })))
              });
            },
            error: (error) => {
              console.error(error);
            }
          });
        },
        error: (error) => {
          console.error(error);
        }
      })
    }
  }

  // * Free Usage Methods
  getFreeUsages() {
    this.freeUsageService.getFreeUsages().subscribe({
      next: (freeUsages) => {
        this.freeUsages = freeUsages
        this.gestionedFreeUsages.data = this.freeUsages.filter(fu => fu.status !== "PENDING")
        this.pendingFreeUsages.data = this.freeUsages.filter(fu => fu.status === "PENDING")
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  updateFreeUsage(freeUsage: FreeUsage, status: boolean) {
    freeUsage.status = status ? "APPROVED" : "DENIED"
    this.freeUsageService.updateFreeUsage(freeUsage).subscribe({
      next: (freeUsage) => {
        this.freeUsages = this.freeUsages.map((fu) => fu.id === freeUsage.id ? freeUsage : fu)
        this.getFreeUsages()
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  // * Mentorings Methods
  getMentorings() {
    this.mentoringService.getMentorings().subscribe({
      next: (mentorings) => {
        this.mentorings = mentorings
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  getMentoringsByRoomId(roomId: number) {
    this.mentoringService.getMentoringsByRoomId(roomId).subscribe({
      next: (mentorings) => {
        this.mentorings = mentorings
      },
      error: (error) => {
        console.error(error)
      }
    })
  }
  // * Utils

  instanceOfFreeUsages(object: any): object is FreeUsage {
    return object.hasOwnProperty('user');
  }

  instanceOfMentorings(object: any): object is Mentoring {
    return object.hasOwnProperty('teacher');
  }


  // * FullCalendar Methods

  toEventApi(timeTables: RoomTimeTable[] | FreeUsage[] | Mentoring[]): EventInput[] {
    let events: EventInput[] = []
    timeTables.forEach((timeTable) => {
      let title = ''

      if (typeof timeTable === 'object') {
        if (this.instanceOfFreeUsages(timeTable)) {
          title = (timeTable as FreeUsage).user.name + " - " + (timeTable as FreeUsage).status + " - Práctica libre"
        } else if (this.instanceOfMentorings(timeTable)) {
          title = (timeTable as Mentoring).student.name + " - " + (timeTable as Mentoring).status + " - Tutoria"
        } else {
          title = (timeTable as RoomTimeTable).status + " - Room Time Table"
        }
      }

      events.push({
        id: timeTable.id!.toString(),
        title: title,
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
        extendedProps: {
          roomId: '',
          reccurence: false
        },
        rrule: {
          freq: 'weekly',
          dtstart: '',
        },
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
    let reccuToggle = this.reccurenceForm.get('recurrToggle')?.value

    calendarApi.unselect(); // clear date selection

    if (title) {
      if(reccuToggle) {

        let event: EventInput = {
          id: '',
          extendedProps: { 
            roomId: this.selectedRoom.id,
            reccurence: true
          },
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          startTime: selectInfo.start.toTimeString(),
          endTime: selectInfo.end.toTimeString(),
          startRecur: selectInfo.startStr,
          allDay: selectInfo.allDay,
          daysOfWeek: [selectInfo.start.getDay()],
          color: 'purple'
        }

        console.log(event)

        calendarApi.addEvent(event);
      } else {

        let event: EventInput = {
          id: '',
          extendedProps: { 
            roomId: this.selectedRoom.id,
            reccurence: false
          },
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        }

        console.log(event)

        calendarApi.addEvent(event);
      }
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
    // this.currentEvents().forEach((event) => {
    //   if (!event.title.includes("-")) {
    //     let id = event.id
    //     let start = event.start?.toISOString()
    //     let end = event.end?.toISOString()
    //     let status = "OCCUPIED"
    //     let roomId = event.extendedProps["roomId"]
    //     roomTimeTable.push({ id: id, start: start!, end: end!, status: status, roomId: roomId, reccurence: event.extendedProps["reccurence"]})
    //   }
    // });

    this.calendar.getEvents().forEach((event) => {
      if (!event.title.includes("-")) {
        let id = event.id
        let start = event.start?.toISOString()
        let end = event.end?.toISOString()
        let status = "OCCUPIED"
        let roomId = event.extendedProps["roomId"]
        roomTimeTable.push({ id: id, start: start!, end: end!, status: status, roomId: roomId, reccurence: event.extendedProps["reccurence"]})
      }
    })


    return roomTimeTable
  }
}
