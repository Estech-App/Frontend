import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/roles/Role';
import { User } from 'src/app/models/users/User';
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
  users: User[] = []
  staff: User[] = []
  students: User[] = []
  roles: Role[] = []
  displayedTeachersColumns = ['name', 'role', 'edit']
  displayedStudentsColumns = ['name', 'course', 'group', 'edit']
  form: FormGroup
  post = true

  roleFormControl = new FormControl<Role | null>(null, Validators.required)
  emailFormControl = new FormControl('', [Validators.required, Validators.email])
  passwordFormControl = new FormControl('', Validators.required)
  lastnameFormControl = new FormControl('', Validators.required)
  nameFormControl = new FormControl('', Validators.required)

  name = ''
  lastname = ''
  email = ''
  role = ''
  password = ''

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getAllUsers()
    this.getRoles()

    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', Validators.required]
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

  divideUsers() {
    this.staff = this.users.filter(user => user.role === 'ADMIN' || user.role === 'TEACHER' || user.role === 'SECRETARY')
    this.students = this.users.filter(user => user.role === 'STUDENT')
  }

  createNewUser() {
    let user: User = {
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
        // #TODO: Ver otra forma de arreglar esto
        window.location.reload()
      }, error: err => {
        console.log(err);
      }
    })
  }

  getUserById(id: string) {
    this.post = false
    this.userService.getUserById(id).subscribe({
      next: res => {
        let user = res
        
        this.form.setValue({
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          password: 'placeholder'
        })
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
        window.location.reload()
        this.post = true
      },
      error: err => {
        console.log(err);
      }
    })
  }

  cleanForm() {
    window.location.reload()
  }
}