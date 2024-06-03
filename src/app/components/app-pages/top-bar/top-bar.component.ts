import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  @Input() name: string = '';
  @Input() lastname: string = '';

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }

}
