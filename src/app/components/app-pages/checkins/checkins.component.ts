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
	post = true

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

		if (this.clickedCheckinsRow != null) {
			this.clickedCheckinsRow = {
				id: '',
				date: '',
				userId: 0,
				checkIn: false,
				user: ''
			}

			this.form.setValue({
				id: '',
				day: '',
				hour: '',
				checkinSelect: ''
			})
		}


		this.clickedEmployeeRow = row
		this.cancelFilter()
	}

	filterCheckinsBySelectedUser(id: string) {
		this.userIdFilteredById = id
		this.isFilteringById = true
		this.checkins.filterPredicate = (data: CheckinDTO, filter: string) => {
			return data.userId.toString() == filter
		}
		this.checkins.filter = id
	}

	filterEmployees(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.employees.filter = filterValue.trim().toLowerCase()
	}

	cancelFilter() {
		this.userIdFilteredById = ''
		this.isFilteringById = false
		this.checkins.filter = ''
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

		this.post = false

		if (this.clickedCheckinsRow === checkin) {
			this.clickedCheckinsRow = {
				id: '',
				date: '',
				userId: 0,
				checkIn: false,
				user: ''
			}
			this.form.reset()
			this.post = true
		} else {
			this.clickedCheckinsRow = checkin
			this.post = false
			this.form.setValue({
				id: checkin.userId,
				day: checkin.date.substring(0, 10),
				hour: checkin.date.substring(11, 19),
				checkinSelect: checkin.checkIn ? 0 : 1
			})
		}
	}

	createCheckin() {
		let checkin: Checkin = {
			id: null,
			date: this.form.get('day')?.value + 'T' + this.form.get('hour')?.value + '.000Z',
			user: {
				id: this.clickedEmployeeRow.id
			},
			checkIn: this.form.get('checkinSelect')?.value == '0' ? true : false
		}

		this.checkinService.checkin(checkin).subscribe({
			next: res => {
				let tmp: CheckinDTO = {
					id: '',
					date: res.date,
					userId: Number(res.user.id),
					checkIn: res.checkIn,
					user: ''
				}
				this.checkins.data = [];
				this.checkins.data.push(tmp);
				this.form.reset();
				this.getCheckins();
			},
			error: err => {
				console.log(err);
			}
		})
	}

	updateCheckin() {

		let checkin: Checkin = {
			id: Number(this.clickedCheckinsRow.id),
			date: this.form.get('day')?.value + 'T' + this.form.get('hour')?.value + '.000Z',
			user: {
				id: String(this.clickedCheckinsRow.userId)
			},
			checkIn: this.form.get('checkinSelect')?.value == '0' ? true : false
		}

		this.checkinService.updateCheckin(checkin).subscribe({
			next: res => {
				let tmp: CheckinDTO = {
					id: '',
					date: res.date,
					userId: Number(res.user.id),
					checkIn: res.checkIn,
					user: ''
				}
				this.checkins.data = [];
				this.checkins.data.push(tmp);
				this.post = true
				this.form.reset();
				this.getCheckins();
			},
			error: err => {
				console.log(err);
			}
		})
	}

}
