import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, NgForm, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
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

  // employees = new MatTableDataSource<User>()
  // checkins = new MatTableDataSource<CheckinDTO>()
  // selectedRow: string = ''
  // selectedName: string = ''
  // selectedCheckin: CheckinDTO

  // dayFormControl = new FormControl('', Validators.required)
  // hourFormControl = new FormControl('', Validators.required)
  // checkinFormControl = new FormControl(['', '--- Seleccionar ---'], Validators.required)

  // displayedEmployeesColumns = ['name', 'role', 'show']
  // displayedCheckinsColumns = ['name', 'date', 'time', 'checkin', 'icon']
  // form: FormGroup
  // post = true
  // isFilteringById = false

  // constructor(private userService: UserService, private checkinService: CheckinService, private formBuilder: FormBuilder) {
  //   this.getCheckins()
  //   this.getEmployees()

  //   this.selectedCheckin = {
  //     id: '',
  //     date: '',
  //     userId: 0,
  //     checkIn: false,
  //     user: ''
  //   }

  //   this.form = this.formBuilder.group({
  //     id: [''],
  //     day: ['', Validators.required],
  //     hour: ['', Validators.required],
  //     checkinSelect: ['', Validators.required]
  //   })
  // }

  // getCheckins() {
  //   this.checkinService.getCheckIn().subscribe({
  //     next: res => {
  //       this.checkins.data = res
  //     },
  //     error: err => {
  //       console.log(err)
  //     }
  //   })
  // }

  // checkin() {
  //   let checkin: Checkin = {
  //     date: this.form.get('day')?.value + 'T' + this.form.get('hour')?.value + ':00.000Z',
  //     user: {
  //       id: this.selectedRow
  //     },
  //     checkIn: this.form.get('checkinSelect')?.value == '0' ? true : false
  //   }

  //   this.checkinService.checkin(checkin).subscribe({
  //     next: res => {
  //       let tmp: CheckinDTO = {
  //         id: '',
  //         date: res.date,
  //         userId: Number(res.user.id),
  //         checkIn: res.checkIn,
  //         user: ''
  //       }
  //       this.checkins.data = [];
  //       this.checkins.data.push(tmp);
  //       this.getCheckins();
  //     },
  //     error: err => {
  //       console.log(err);
  //     }
  //   })
  // }

  // updateCheckin() {
  //   let checkin: Checkin = {
  //     date: this.form.get('day')?.value + 'T' + this.form.get('hour')?.value + ':00.000Z',
  //     user: {
  //       id: this.selectedRow
  //     },
  //     checkIn: this.form.get('checkinSelect')?.value == '0' ? true : false
  //   }

  //   this.checkinService.updateCheckin(checkin).subscribe({
  //     next: res => {
  //       let tmp: CheckinDTO = {
  //         id: '',
  //         date: res.date,
  //         userId: Number(res.user.id),
  //         checkIn: res.checkIn,
  //         user: ''
  //       }
  //       this.checkins.data = [];
  //       this.checkins.data.push(tmp);
  //       this.post = true
  //       this.getCheckins();
  //     },
  //     error: err => {
  //       console.log(err);
  //     }
  //   })
  // }


  // getEmployees() {
  //   this.userService.getUsers().subscribe({
  //     next: res => {
  //       this.employees.data = res
  //     },
  //     error: err => {
  //       console.log(err)
  //     }
  //   })
  // }

  // selectCheckinRow(row: CheckinDTO) {
  //   this.form.setValue({
  //     id: row.userId,
  //     day: row.date.substring(0, 10),
  //     hour: row.date.substring(11, 16),
  //     checkinSelect: row.checkIn ? 0 : 1
  //   })    
  // }

  // addRowIdToSelectedRow(id: string) {
  //   if (this.selectedRow === id) {
  //     this.selectedRow = ''
  //     this.selectedName = ''
  //     return
  //   }
  //   this.selectedRow = id
  //   this.selectedName = this.employees.data.find(employee => employee.id == id)?.name! + ' ' + this.employees.data.find(employee => employee.id == id)?.lastname!
  // }

  // filterCheckinsBySelectedUser(id: string) {
  //   this.isFilteringById = true
  //   this.checkins.filterPredicate = (data: CheckinDTO, filter: string) => {
  //     return data.userId.toString() == filter
  //   }
  //   this.checkins.filter = id
  // }

  // resetIdFilter() {
  //   this.isFilteringById = false
  //   this.checkins.filter = ''
  // }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.employees.filter = filterValue.trim().toLowerCase();
  // }

  // fillForm(selectedCheckin: CheckinDTO) {
  //   this.post = false
  //   this.form.setValue({
  //     id: this.selectedRow,
  //     day: selectedCheckin.date.substring(0, 10),
  //     hour: selectedCheckin.date.substring(11, 16),
  //     checkinSelect: selectedCheckin.checkIn ? 0 : 1
  //   })
  //   console.log(selectedCheckin);

  // }

  //* Parte de empleados
  employeeColumns = ['name', 'role', 'show']
  employees = new MatTableDataSource<User>()
  clickedEmployeeRow: User
  isFilteringById = false
  userIdFilteredById: string = ''

  //* Parte de checkins
  checkinsColumns = ['name', 'date', 'time', 'checkin', 'icon']
  checkins = new MatTableDataSource<CheckinDTO>()
  clickedCheckinsRow: CheckinDTO

  //* Parte formulario
  form: FormGroup

  constructor(private userService: UserService, private checkinService: CheckinService, private formBuilder: FormBuilder) {
    this.getEmployees()
    this.getCheckins()

    this.clickedEmployeeRow = {
      id: '',
      name: '',
      lastname: '',
      email: '',
      role: '',
      password: ''
    }

    this.clickedCheckinsRow = {
      id: '',
      date: '',
      userId: 0,
      checkIn: false,
      user: ''
    }

    this.form = this.formBuilder.group({
      id: [''],
      day: ['', Validators.required],
      hour: ['', Validators.required],
      checkinSelect: ['', Validators.required]
    })

  }

  getEmployees() {
    this.userService.getUsers().subscribe({
      next: res => {
        this.employees.data = res
      },
      error: err => {
        console.log(err)
      }
    })
  }

  addRowToClicked(row: User) {
    if (this.clickedEmployeeRow === row) {
      this.clickedEmployeeRow = {
        id: '',
        name: '',
        lastname: '',
        email: '',
        role: '',
        password: ''
      }
      return
    }
    this.clickedEmployeeRow = row
    //TODO: Ver si se puede hacer algo con esto
    this.userIdFilteredById = ''
    this.isFilteringById = false
  }

  //TODO: Terminar funciones de filtrado
  filterCheckinsBySelectedUser(id: string) {
    this.userIdFilteredById = id
    this.isFilteringById = true
  }

  cancelFilter() {
    this.userIdFilteredById = ''
    this.isFilteringById = false
  }

  getCheckins() {
    this.checkinService.getCheckIn().subscribe({
      next: res => {
        this.checkins.data = res
      },
      error: err => {
        console.log(err)
      }
    })
  }

  fillCheckInForm(checkin: CheckinDTO) {
    this.form.setValue({
      id: checkin.userId,
      day: checkin.date.substring(0, 10),
      hour: checkin.date.substring(11, 16),
      checkinSelect: checkin.checkIn ? 0 : 1
    })
  }

}
