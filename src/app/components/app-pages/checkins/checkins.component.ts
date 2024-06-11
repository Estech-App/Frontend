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
	checkinsColumns = ['name', 'date', 'time', 'checkin', 'icon', 'actions']
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
			this.post = true
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

			this.post = true
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

		if (this.clickedCheckinsRow === checkin) {
			this.clearForm()
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
			this.clickedEmployeeRow = {
				id: '',
				name: '',
				lastname: '',
				email: '',
				role: '',
				password: ''
			}
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

		if (this.clickedEmployeeRow.id == '') {
			alert('Debes seleccionar un empleado')
			return
		} else {
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
					this.clearForm()
					this.getCheckins();
				},
				error: err => {
					console.log(err);
				}
			})
		}
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
				this.clearForm();
				this.getCheckins();
			},
			error: err => {
				console.log(err);
			}
		})
	}

	deleteCheckin(checkin: CheckinDTO) {
		let id: number = Number(checkin.id)
		if (confirm(`Vas a eliminar el CHECKIN del usuario ${checkin.user}, con fecha ${checkin.date.split('T')[0]} a las ${checkin.date.split('T')[1].split('.')[0]}. ¿Estás seguro?`)) {
			this.checkinService.deleteCheckin(id).subscribe({
				next: res => {
					this.getCheckins()
				},
				error: err => {
					console.log(err)
				}
			})
		}
	}

	clearForm() {
		this.form.reset()
		this.post = true
		this.clickedCheckinsRow = {
			id: '',
			date: '',
			userId: 0,
			checkIn: false,
			user: ''
		}
		this.clickedEmployeeRow = {
			id: '',
			name: '',
			lastname: '',
			email: '',
			role: '',
			password: ''
		}
	}

}