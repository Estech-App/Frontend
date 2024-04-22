import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Room } from 'src/app/models/rooms/Room';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  form: FormGroup
  roomColumns: string[] = ["name", "group", "actions"]
  rooms: Room[] = []
  selectedRow: Room

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: '',
      group: {
        id: '',
      },
      studyRoom: false,
      mentoringRoom: false,
    })

    this.selectedRow = {
      id: 0,
      name: '',
      description: '',
      mentoringRoom: false,
      studyRoom: false,
      freeUsages: [{ id: 0 }],
      mentorings: [{ id: 0 }],
      stocks: [{ id: 0 }],
      groups: [{ id: 0 }],
      roomTimeTables: [{ id: 0 }]
    }
  }

}
