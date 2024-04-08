import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, NgForm, FormControl } from '@angular/forms';
import { Checkin } from 'src/app/models/checkin/Checkin';
import { CheckinDTO } from 'src/app/models/checkin/CheckinDTO';
import { User } from 'src/app/models/users/User';
import { CheckinService } from 'src/app/services/checkin/checkin.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-checkins',
  templateUrl: './checkins.component.html',
  styleUrls: ['./checkins.component.css']
})
export class CheckinsComponent {

  employees: User[] = []
  checkins: CheckinDTO[] = []
  selectedRow: string = ''
  selectedName: string = ''

  dayFormControl = new FormControl('', Validators.required)
  hourFormControl = new FormControl('', Validators.required)
  checkinFormControl = new FormControl(['', '--- Seleccionar ---'], Validators.required)

  displayedEmployeesColumns = ['name', 'role', 'show']
  displayedCheckinsColumns = ['name', 'date', 'time', 'checkin', 'icon']
  form: FormGroup
  post = true

  constructor(private userService: UserService, private checkinService: CheckinService, private formBuilder: FormBuilder) {
    this.getCheckins()
    this.getEmployees()

    this.form = this.formBuilder.group({
      id: [''],
      day: ['', Validators.required],
      hour: ['', Validators.required],
      checkinSelect: ['', Validators.required]
    })
  }

  getCheckins() {
    this.checkinService.getCheckIn().subscribe({
      next: res => {
        this.checkins = res
        console.log(this.checkins);
        
      },
      error: err => {
        console.log(err)
      }
    })
  }

  checkin() {
    let checkin: Checkin = {
      date: this.form.get('day')?.value + 'T' + this.form.get('hour')?.value + ':00.000Z',
      user: {
        id: this.selectedRow
      },
      checkIn: this.form.get('checkinSelect')?.value == '0' ? true : false
    }

    this.checkinService.checkin(checkin).subscribe({
      next: res => {
        let tmp: CheckinDTO = {
          date: res.date,
          userId: Number(res.user.id),
          checkIn: res.checkIn,
          user: ''
        }
        this.checkins = [];
        this.checkins.push(tmp);
        this.getCheckins();
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getEmployees() {
    this.userService.getUsers().subscribe({
      next: res => {
        this.employees = res
      },
      error: err => {
        console.log(err)
      }
    })
  }

  addRowIdToSelectedRow(id: string) {
    this.selectedRow = id
    this.selectedName = this.employees.find(employee => employee.id == id)?.name! + ' ' + this.employees.find(employee => employee.id == id)?.lastname!
    console.log(this.selectedRow);
  }

  //TODO: Arreglar filtrado

  filterCheckinsBySelectedUser(id: number) {
    this.checkins = this.checkins.filter(checkin => checkin.userId == id)    
    console.log(this.checkins);
  }
}
