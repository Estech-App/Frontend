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
  teachers: User[] = []
  students: User[] = []
  displayedTeachersColumns = ['name', 'role', 'edit']
  displayedStudentsColumns = ['name', 'course', 'group', 'edit']

  name = 'Clear me'
  color = '#009CB5'
  fontColor = 'white'

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getAllUsers()
    this.divideUsers()
  }

  getAllUsers(): void {
    this.userService.getUsers().subscribe({
      next: res => {
        console.log(res);
        
        this.users = res;
      }, error: err => {
        console.log(err);
      }
    })
  }

  divideUsers() {
    this.teachers = this.users.filter(user => user.role === 'TEACHER')
    this.students = this.users.filter(user => user.role === 'STUDENT')
  }
}
