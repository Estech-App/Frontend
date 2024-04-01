import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  displayedEmployeesColumns = ['name', 'role', 'show']
  displayedCheckinsColumns = ['name', 'date', 'time', 'checkin', 'icon']
  form: FormGroup
  post = true

  constructor(private userService: UserService, private checkinService: CheckinService, private formBuilder: FormBuilder) {
    this.getCheckins()
    this.getEmployees()

    this.form = this.formBuilder.group({
      userId: [''],
      hour: ['', Validators.required],
      date: ['', Validators.required],
      checkin: ['', Validators.required]
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

  async getEmployees() {
    this.userService.getUsers().subscribe({
      next: res => {
        this.employees = res
        console.log(this.employees);
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
