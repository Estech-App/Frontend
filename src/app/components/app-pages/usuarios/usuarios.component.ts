import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/courses/Course';
import { Group } from 'src/app/models/groups/Group';
import { Role } from 'src/app/models/roles/Role';
import { Student } from 'src/app/models/users/Student';
import { User } from 'src/app/models/users/User';
import { CourseService } from 'src/app/services/courses/course.service';
import { GroupService } from 'src/app/services/group/group.service';
import { RoleService } from 'src/app/services/roles/role.service';
import { UserService } from 'src/app/services/users/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent {
  [x: string]: any;
  users: User[] = []
  staff: User[] = []
  students: User[] = []
  roles: Role[] = []
  groups: Group[] = []
  courses: Course[] = []
  displayedTeachersColumns = ['name', 'role', 'edit']
  displayedStudentsColumns = ['name', 'course', 'group', 'edit']
  form: FormGroup
  post = true
  roleName = ''
  passwordIsHide = true

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private groupService: GroupService
  ) {
    this.getAllUsers()
    this.getRoles()
    this.getCourses()
    this.getGroups()

    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', Validators.required],
      group: [''],
    })

    this.form.get('role')?.valueChanges.subscribe({
      next: res => {
        this.roleName = res
        if (res != 'STUDENT') {
          this.form.get('group')?.setValue(null)
        }
      }
    })
  }

  getAllUsers(): void {
    this.userService.getUsers().subscribe({
      next: res => {
        this.users = res;
        this.divideUsers()
      }, error: err => {
        console.log(err);
      }
    })
  }

  getRoles(): void {
    this.roleService.getRoles().subscribe({
      next: res => {
        this.roles = res
      }, error: err => {
        console.log(err);
      }
    })
  }

  getCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: res => {
        this.courses = res
      }, error: err => {
        console.log(err);
      }
    })
  }

  getGroups(): void {
    this.groupService.getGroups().subscribe({
      next: res => {
        this.groups = res
      }, error: err => {
        console.log(err);
      }
    })
  }

  divideUsers() {
    this.staff = this.users.filter(user => user.role === 'ADMIN' || user.role === 'TEACHER' || user.role === 'SECRETARY')
    this.students = this.users.filter(user => user.role === 'STUDENT')
  }

  createNewUser() {

    if (this.form.get('group')?.value !== null && this.roleName === 'STUDENT') {
      let student = {
        id: '',
        name: this.form.get('name')?.value,
        lastname: this.form.get('lastname')?.value,
        email: this.form.get('email')?.value,
        role: this.form.get('role')?.value,
        password: this.form.get('password')?.value,
        groups: this.form.get('group')?.value
      }

      console.log(student)

      this.userService.createNewStudent(student).subscribe({
        next: res => {
          this.getAllUsers()
          this.form.reset()
          this.post = true
        }, error: err => {
          console.log(err);
        }
      })

    } else {
      let user = {
        id: '',
        name: this.form.get('name')?.value,
        lastname: this.form.get('lastname')?.value,
        email: this.form.get('email')?.value,
        role: this.form.get('role')?.value,
        password: this.form.get('password')?.value,
      }

      this.userService.createNewUser(user).subscribe({
        next: res => {
          this.getAllUsers()
          this.form.reset()
          this.post = true
        }, error: err => {
          console.log(err);
        }
      })

    }
  }

  getUserById(id: string) {
    this.post = false
    this.userService.getUserById(id).subscribe({
      next: res => {
        let user = res
        this.form.patchValue(user)
      }, error: err => {
        console.log(err);
      }
    })
  }

  getStudentById(id: string) {
    this.post = false
    this.userService.getStudentById(id).subscribe({
      next: res => {
        let student: Student = res
        console.log(student);
        this.form.patchValue(student)
        this.form.controls['group'].setValue([
          //TODO: FIX THIS
          student.groups.map(group => group.id)
        ])
      }, error: err => {
        console.log(err);
      }
    })
  
  }

  updateUser() {
    let user: User = {
      id: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
      lastname: this.form.get('lastname')?.value,
      email: this.form.get('email')?.value,
      role: this.form.get('role')?.value,
      password: this.form.get('password')?.value,
    }

    console.log(user);

    this.userService.updateUser(user).subscribe({
      next: res => {
        this.getAllUsers()
        this.form.reset()
        this.post = true
      },
      error: err => {
        console.log(err);
      }
    })
  }
}