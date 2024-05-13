import { group } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupDTO } from 'src/app/models/group/GroupDTO';
import { Room } from 'src/app/models/rooms/Room';
import { GroupService } from 'src/app/services/groups/group.service';
import { RoomService } from 'src/app/services/rooms/room.service';

interface RoomTimeTable {
  day: string
  hour: string
}

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
  scheduleColumns = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]
  scheduleRows = ["8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]
  selectedHours: RoomTimeTable[] = []

  constructor(private formBuilder: FormBuilder, private roomService: RoomService, private groupService: GroupService) {
    this.form = this.formBuilder.group({
      id: null,
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
      freeUsages: [{ id: null }],
      mentorings: [{ id: null }],
      stocks: [{ id: null }],
      groups: [{ id: null }],
      roomTimeTables: [{ id: null }]
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
      id: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
      mentoringRoom: this.form.get('mentoringRoom')?.value,
      studyRoom: this.form.get('studyRoom')?.value,
      groups: this.form.get('groups')?.value ?? 1,
      description: this.form.get('description')?.value,
      stocks: [{ id: null }],
      mentorings: [{ id: null }],
      freeUsages: [{ id: null }],
      roomTimeTables: [{ id: null }]
    }
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

  addAndDeleteToSelectedHours(day: string, hour: string) {
    let selectedHour = this.checkIfSelected(day, hour)
    if (selectedHour) {
      this.selectedHours = this.selectedHours.filter((time) => time !== selectedHour)
    } else {
      this.selectedHours.push({ day, hour })
    }
  }

  checkIfSelected(day: string, hour: string) {
    return this.selectedHours.find((time) => time.day === day && time.hour === hour)
  }

  addRowToClicked(row: Room) {
    this.selectedRoom = row
  }
}
