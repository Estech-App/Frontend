import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  name = sessionStorage.getItem('name') != null ? sessionStorage.getItem('name') : '';
  lastname = sessionStorage.getItem('lastname') != null ? sessionStorage.getItem('lastname') : '';

}
