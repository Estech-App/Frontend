import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login/LoginModel';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup

  constructor(private tokenService: TokenService, private formBuilder: FormBuilder, private router: Router) {
    this.form = this.formBuilder.group({
      email: '',
      password: ''
    })
  }

  authenticate(): void {
    let login: LoginModel = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    }

    this.tokenService.login(login).subscribe({
      next: res => {
        if (res.roles[0].authority === 'ROLE_ADMIN') {
          if (sessionStorage.getItem('token') != null) {
            sessionStorage.removeItem('token')
          }
          if (sessionStorage.getItem('email') != null) {
            sessionStorage.removeItem('email')
          }
          sessionStorage.setItem('token', res.token)
          sessionStorage.setItem('email', res.username)
          if (res.token != null) {
            this.router.navigateByUrl('/dashboard')
          }
        } else {
          alert('No tienes permisos para acceder a esta aplicación.')
        }
      },
      error: err => {
        console.log(err)
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('username')
        alert('El usuario o la contraseña son incorrectos. Por favor, inténtelo de nuevo.')
      }
    })
  }
}
