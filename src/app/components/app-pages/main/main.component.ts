import { Component } from '@angular/core';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private tokenService: TokenService) {
    let email = sessionStorage.getItem('email')
    if (email != null) {
      this.tokenService.userInfo(email).subscribe({
        next: res => {
          if (sessionStorage.getItem('userId') != null) {
            sessionStorage.removeItem('userId')
          }
          if (sessionStorage.getItem('name') != null) {
            sessionStorage.removeItem('name')
          }
          if (sessionStorage.getItem('lastname') != null) {
            sessionStorage.removeItem('lastname')
          }
          sessionStorage.setItem('userId', res.id.toString())
          sessionStorage.setItem('name', res.name)
          sessionStorage.setItem('lastname', res.lastname)
        }, error: err => {
          sessionStorage.removeItem('userId')
          sessionStorage.removeItem('name')
          sessionStorage.removeItem('lastname')
        }
      })

    }
  }

}
