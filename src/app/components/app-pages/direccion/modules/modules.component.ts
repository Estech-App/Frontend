import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent {
  modules = []
  displayedColumns = ['nameAndTeacher', 'button'];
  form: FormGroup
  name = ''
  teacherName = ''

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: '',
      teacherName: ''
    })
  }

}
