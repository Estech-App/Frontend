import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Group } from 'src/app/models/groups/Group';
import { GroupService } from 'src/app/services/groups/group.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent {

  groups: Group[] = []
  displayedColumns = ['name', 'description', 'year']
  form: FormGroup

  constructor(
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getAllGroups()
    this.form = this.formBuilder.group({
      id: '',
      name: '',
      description: ''
    })
  }

  getAllGroups() {
    this.groupService.getAllGroups().subscribe({
      next: res => {
        this.groups = res
      }, error: err => {
        console.log(err);
      }
    })

  }

  createNewGroup(): void {

  }

  getGroupById(id: number) {

  }

}
