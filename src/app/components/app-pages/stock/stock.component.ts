import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Room } from 'src/app/models/rooms/Room';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
  rooms: Room[] = []
  roomDisplayedColumns: string[] = ['name', 'group']

  stocks: any[] = []
  stockDisplayedColumns: string[] = ['name', 'description', 'room', 'quantity']

  form: FormGroup

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: '',
      quantity: null,
      description: '',
      roomId: ''
    });
  }
}
