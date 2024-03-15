import { Component } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';

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
          console.log(res)
        }, error: err => {
          console.log(err)
        }
      })

    }
  }

}
