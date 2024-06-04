import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/courses/Course';
import { ModuleCreationDTO } from 'src/app/models/module/ModuleCreationDTO';
import { ModuleDTO } from 'src/app/models/module/ModuleDTO';
import { User } from 'src/app/models/users/User';
import { CourseService } from 'src/app/services/courses/course.service';
import { ModuleService } from 'src/app/services/module/module.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
	selector: 'app-modules',
	templateUrl: './modules.component.html',
	styleUrls: ['./modules.component.css']
})
export class ModulesComponent {
	modules: MatTableDataSource<ModuleDTO> = new MatTableDataSource<ModuleDTO>();
	displayedColumns = ['nameAndTeacher', 'acronym', 'edit'];
	form: FormGroup
	name = ''
	acronym = ''
	teachers: User[] = []
	courses: Course[] = []
	formError = false
	selections: string[] = []
	post = true

	constructor(
		private courseService: CourseService,
		private userService: UserService,
		private moduleService: ModuleService,
		private formBuilder: FormBuilder,
		private router: Router
	) {
		this.getAllCourses()
		this.getAllTeachers()
		this.getAllModules()
		this.form = this.formBuilder.group({
			id: [''],
			name: [''],
			acronym: [''],
			year: [''],
			course: [],
			teachers: [],
			color: ['']
		})
	}

	getAllModules() {
		this.moduleService.getAllModules().subscribe({
			next: res => {
				this.modules.data = res
			}
		})
	}

	getAllTeachers() {
		this.userService.getByRoleId(3).subscribe({
			next: res => {
				this.teachers = res
			}
		})
	}

	getAllCourses() {
		this.courseService.getAllCourses().subscribe({
			next: res => {
				this.courses = res
			}
		})
	}

	getModuleById(id: number) {
		// TODO - NEEDS TO FILL THE FORM WITH MODULE INFO (INCLUDING TEACHERS)
		this.post = false
		this.selections = []
		this.moduleService.getModuleById(id).subscribe({
			next: res => {
				res.usersName.forEach(teacherName => {
					this.teachers.forEach(teacher => {
						if (teacherName === teacher.name) {
							this.selections.push(teacher.id);
						}
					})
				})
				console.log(this.selections);
				console.log(res)
				this.form.setValue({
					id: res.id,
					name: res.name,
					acronym: res.acronym,
					year: res.year,
					course: res.courseDTO.id,
					teachers: this.selections,
					color: res.color
				})
			}
		})
	}

	// TODO - UPDATE MODULE FUNCTION!!!!!

	createNewModule() {
		let name = this.form.get('name')?.value
		let acronym = this.form.get('acronym')?.value
		let year = this.form.get('year')?.value
		let course: number = this.form.get('course')?.value
		let user: number[] = this.form.get('teachers')?.value
		let color = this.form.get('color')?.value

		if (
			name == null || name == '' ||
			acronym == null || acronym == '' ||
			year == null || year == '' ||
			course == null || color == null
		) {
			this.formError == true
			return
		}

		let newModule: ModuleCreationDTO = new ModuleCreationDTO()
		newModule.name = name
		newModule.acronym = acronym
		newModule.year = year
		newModule.course.id = course
		newModule.color = color

		newModule.users = []
		if (user != null) {
			user.forEach(teacherId => {
				newModule.users.push({ id: teacherId })
			});
		}

		this.moduleService.createNewModule(newModule).subscribe({
			next: res => {
				console.log(res)
				this.getAllModules()
			},
			error: err => {
				console.log(err)
			}
		})

		// FIND ANOTHER WAY TO RESET THE FORM FIELDS
		this.form.reset()
	}

	updateModule() {
		let id = this.form.get('id')?.value
		let name = this.form.get('name')?.value
		let acronym = this.form.get('acronym')?.value
		let year = this.form.get('year')?.value
		let course: number = this.form.get('course')?.value
		let user: number[] = this.form.get('teachers')?.value
		let color = this.form.get('color')?.value

		if (
			name == null || name == '' ||
			acronym == null || acronym == '' ||
			year == null || year == '' ||
			course == null || color == null
		) {
			this.formError == true
			return
		}

		let updatedModule: ModuleCreationDTO = new ModuleCreationDTO()
		updatedModule.id = id
		updatedModule.name = name
		updatedModule.acronym = acronym
		updatedModule.year = year
		updatedModule.course.id = course
		updatedModule.color = color

		updatedModule.users = []
		if (user != null) {
			user.forEach(teacherId => {
				updatedModule.users.push({ id: teacherId })
			});
		}

		console.log(updatedModule)

		this.moduleService.updateModule(updatedModule).subscribe({
			next: res => {
				console.log(res)
				this.getAllModules()
				this.post = true
			},
			error: err => {
				console.log(err)
			}
		})

		// FIND ANOTHER WAY TO RESET THE FORM FIELDS
		this.form.reset()
	}

}
