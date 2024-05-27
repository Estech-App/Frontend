import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Room } from 'src/app/models/rooms/Room';
import { Stock } from 'src/app/models/stock/Stock';
import { RoomService } from 'src/app/services/rooms/room.service';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
  rooms: MatTableDataSource<Room> = new MatTableDataSource<Room>();
  roomDisplayedColumns: string[] = ['name']

  stocks: MatTableDataSource<Stock> = new MatTableDataSource<Stock>();
  stockDisplayedColumns: string[] = ['name', 'description', 'room', 'quantity', 'actions']

  form: FormGroup

  currentRoom: Room
  currentEditStock: Stock

  post = true;

  constructor(private formBuilder: FormBuilder, private roomService: RoomService, private stockService: StockService) {
    this.form = this.formBuilder.group({
      id: null,
      name: '',
      quantity: null,
      description: '',
      room: {
        id: ''
      }
    });

    this.currentRoom = {
      id: null,
      name: '',
      description: '',
      mentoringRoom: false,
      studyRoom: false,
      timeTables: []
    }

    this.currentEditStock = {
      id: null,
      name: '',
      description: '',
      quantity: 0,
      room: {
        id: null,
        name: ''
      }
    }
  }

  ngOnInit() {
    this.getRooms();
    this.getStocks();
  }

  //* Room methods

  getRooms() {
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms.data = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  selectRoom(room: Room) {
    if (room && room === this.currentRoom) {
      this.currentRoom = {
        id: null,
        name: '',
        description: '',
        mentoringRoom: false,
        studyRoom: false,
        timeTables: []
      }
      this.getStocks();
    } else {
      this.currentRoom = room;
      if (room.id !== null) {
        this.getStockByRoomId(room.id);
      }
    }
  }

  //* Stock methods

  calculatoTotalRoomStock() {
    let total = 0;

  }

  getStocks() {
    this.stockService.getStocks().subscribe({
      next: (data) => {
        this.stocks.data = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getStockByRoomId(roomId: number) {
    this.stockService.getStockByRoomId(roomId).subscribe({
      next: (data) => {
        this.stocks.data = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  addStockToRoom() {
    const stock: Stock = this.form.value;
    stock.room = {
      id: this.form.get('room')?.value,
      name: ''
    }
    console.log(stock);
    this.stockService.addStockToRoom(stock).subscribe({
      next: (data) => {
        this.getStocks();
        this.form.reset();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  updateStock() {
    const stock: Stock = this.form.value;
    stock.room = this.currentRoom;
    this.stockService.updateStock(stock).subscribe({
      next: (data) => {
        this.getStocks();
        this.form.reset();
        this.post = true;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  removeStock() {
    const stock: Stock = this.form.value;
    if (stock.id === null) {
      alert('No se puede eliminar el stock sin un id válido.')
      return;
    }
    this.stockService.removeStock(stock.id).subscribe({
      next: (data) => {
        this.getStocks();
        this.form.reset();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  //* Form methods

  editStock(stock: Stock) {
    if (this.currentEditStock === stock) {
      this.currentEditStock = {
        id: null,
        name: '',
        description: '',
        quantity: 0,
        room: {
          id: null,
          name: ''
        }
      }
      this.form.reset();
      this.post = true;
    } else {
      this.currentEditStock = stock;
      this.form.setValue(stock);

      this.form.get('room')?.setValue(stock.room.id);

      this.post = false;
      console.log(stock)
    }
  }

}
