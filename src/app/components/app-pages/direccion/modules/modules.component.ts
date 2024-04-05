import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  modules: ModuleDTO[] = []
  displayedColumns = ['nameAndTeacher', 'acronym', 'edit'];
  form: FormGroup
  name = ''
  acronym = ''
  teachers: User[] = []
  courses: Course[] = []
  formError = false

  nameFormControl = new FormControl('', Validators.required)
  acronymFormControl = new FormControl('', Validators.required)
  yearFormControl = new FormControl(0, Validators.required) // Radio Button!!!
  courseFormControl = new FormControl<Course | null>(null, Validators.required)
  teacherFormControl = new FormControl<User[] | null>(null, Validators.required)

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
      name: ['', Validators.required],
      acronym: ['', Validators.required],
	  year: ['', Validators.required],
	  course: [null, Validators.required],
	  teachers: [[null], Validators.required]
    })
  }

  getAllModules() {
	this.moduleService.getAllModules().subscribe({
		next: res => {
			this.modules = res
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
  }

  createNewModule() {
	let name = this.form.get('name')?.value
	let acronym = this.form.get('acronym')?.value
	let year = this.form.get('year')?.value
	let course: number = this.form.get('course')?.value
	let user: number[] = this.form.get('teachers')?.value

	if (
		name == null || name == '' ||
		acronym == null || acronym == '' ||
		year == null || year == '' ||
		course == null || user == null
	) {
		this.formError == true
		return
	}

	let newModule: ModuleCreationDTO = new ModuleCreationDTO()
	newModule.name = name
	newModule.acronym = acronym
	newModule.year = year
	newModule.course.id = course

	newModule.users = []
	user.forEach(teacherId => {
		newModule.users.push({id: teacherId})
	});

	this.moduleService.createNewModule(newModule).subscribe({
		next: res => {
			console.log(res)
		}
	})

	// FIND ANOTHER WAY TO RESET THE FORM FIELDS
	window.location.reload()
  }

}
