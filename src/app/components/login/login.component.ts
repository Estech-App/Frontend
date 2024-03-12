import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/LoginModel';
import { TokenService } from 'src/app/services/token.service';

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
        if(sessionStorage.getItem('token') != null) {
          sessionStorage.removeItem('token')
        }
        sessionStorage.setItem('token', res.token)
        if(res.token != null) {
          this.router.navigateByUrl('/dashboard')
        }
      },
      error: err => {
        console.log(err)
        sessionStorage.removeItem('token')
      }
    })
  }
}
