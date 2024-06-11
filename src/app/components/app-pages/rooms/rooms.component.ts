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

  @ViewChild('calendar') calendar!: any;

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
      right: 'timeGridWeek,timeGridDay'
    },
    initialView: 'timeGridWeek',
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


  }

  ngOnInit(): void {
    this.getRooms()
    this.getFreeUsages()
    this.getMentorings()
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

    this.roomService.createRoom(room).subscribe({
      next: (room) => {
        this.rooms.data.push(room)
        this.form.reset()
        this.getRooms()
        this.calendar.calendar.removeAllEvents()
        this.reccurenceForm.setValue({ recurrToggle: false })
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

    this.roomService.updateRoom(room).subscribe({
      next: (room) => {
        this.rooms.data = this.rooms.data.map((r) => r.id === room.id ? room : r)
        this.post = true
        this.form.reset()
        this.getRooms()
        this.calendar.calendar.removeAllEvents()
        this.reccurenceForm.setValue({ recurrToggle: false })
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
      this.calendar.calendar.removeAllEvents()
      this.post = true

      this.getFreeUsages()
      this.getMentorings()
    } else {
      this.post = false
      this.selectedRoom = row

      this.form.setValue({
        id: row.id,
        name: row.name,
        mentoringRoom: row.mentoringRoom,
        studyRoom: row.studyRoom,
        description: row.description
      })

      this.freeUsageService.getFreeUsagesByRoomId(row.id ?? 0).subscribe({
        next: (freeUsages) => {
          this.freeUsages = freeUsages;
          this.gestionedFreeUsages.data = this.freeUsages.filter(fu => fu.status !== "PENDING");
          this.pendingFreeUsages.data = this.freeUsages.filter(fu => fu.status === "PENDING");

          this.mentoringService.getMentoringsByRoomId(row.id ?? 0).subscribe({
            next: (mentorings) => {
              this.mentorings = mentorings;

              row.timeTables.forEach((event: any) => {
                event.title = "Ocupado"
                if (event.reccurence) {
                  event.color = 'purple'
                  event.daysOfWeek = event.dayOfWeek
                  let startString: Date = new Date(event.start)
                  event.startTime = startString.toTimeString()
                  let endString: Date = new Date(event.end)
                  event.endTime = endString.toTimeString()
                  event.startRecur = event.startStr
                  event.allDay = false
                }
                this.calendar.calendar.addEvent(event)
              })
              this.mentorings.forEach((event: any) => {
                event.title = event.student.name + " - " + event.status + " - Tutoria"
                event.color = 'orange'
                this.calendar.calendar.addEvent(event)
              })
              this.freeUsages.forEach((event: any) => {
                event.title = event.user.name + " - " + event.status + " - Práctica libre"
                event.color = 'green'
                this.calendar.calendar.addEvent(event)
              })
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

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = "Ocupado"
    const calendarApi = selectInfo.view.calendar;
    let reccuToggle = this.reccurenceForm.get('recurrToggle')?.value

    calendarApi.unselect(); // clear date selection

    if (title) {
      if (reccuToggle) {

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
          allDay: false,
          daysOfWeek: [selectInfo.start.getDay()],
          color: 'purple'
        }

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
    let calendarEvents = this.calendar.calendar.getEvents()

    calendarEvents.forEach((event: any) => {
      if (!event.title.includes("-")) {
        let id = event.id
        let start = event.start?.toISOString()
        let end = event.end?.toISOString()
        let status = "OCCUPIED"
        let roomId = event.extendedProps["roomId"]
        let dayOfWeek = ''
        if (event.extendedProps["reccurence"]) {
          dayOfWeek = event.start?.getDay().toString() ?? ''
        }
        roomTimeTable.push({ id: id, start: start!, end: end!, status: status, roomId: roomId, reccurence: event.extendedProps["reccurence"], dayOfWeek: dayOfWeek })
      }
    })

    return roomTimeTable
  }

  deleteRoom(room: Room) {
    let id: number = Number(room.id)
    if (confirm(`Vas a eliminar la sala ${room.name}. ¿Estás seguro?`)) {
      this.roomService.deleteRoom(id).subscribe({
        next: (res) => {
          this.getRooms()
          this.selectedRoom = {
            id: null,
            name: '',
            description: '',
            mentoringRoom: false,
            studyRoom: false,
            timeTables: []
          }
          this.form.reset()
          this.calendar.calendar.removeAllEvents()
        },
        error: (error) => {
          console.error(error)
        }
      })
    }
  }
}