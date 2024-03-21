import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Module } from 'src/app/models/module/Module';
import { ModuleService } from 'src/app/services/module/module.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent {
  modules: Module[] = []
  displayedColumns = ['nameAndTeacher', 'button'];
  form: FormGroup
  name = ''
  teachersName: string[] = []

  constructor(
    private moduleService: ModuleService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: '',
      teacherName: ''
    })
  }

}
