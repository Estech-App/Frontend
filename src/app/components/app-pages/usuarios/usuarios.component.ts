import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/users/User';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  users: User[] = [];
  staff: User[] = []
  students: User[] = []
  displayedTeachersColumns = ['name', 'role', 'edit']
  displayedStudentsColumns = ['name', 'course', 'group', 'edit']
  form: FormGroup
  name = ''
  lastname = ''
  email = ''
  role = ''
  password = ''

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getAllUsers()

    this.form = this.formBuilder.group({
      name: '',
      lastname: '',
      email: '',
      role: '',
      password: ''
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

  divideUsers() {
    this.staff = this.users.filter(user => user.role === 'ADMIN' || user.role === 'TEACHER' || user.role === 'SECRETARY')
    this.students = this.users.filter(user => user.role === 'STUDENT')
  }

  createNewUser() {
    let user: User = {
      name: this.form.get('name')?.value,
      lastname: this.form.get('lastname')?.value,
      email: this.form.get('email')?.value,
      role: this.form.get('role')?.value,
      password: this.form.get('password')?.value,
    }

    this.userService.createNewUser(user).subscribe({
      next: res => {
        this.getAllUsers()
        this.form.setValue({name: '', lastname: '', email: '', role: '', password: ''})
      }, error: err => {
        console.log(err);
      }
    })

  }
}
