import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Group } from 'src/app/models/groups/Group';
import { Mentoring } from 'src/app/models/mentorings/Mentoring';
import { Teacher } from 'src/app/models/users/Teacher';
import { User } from 'src/app/models/users/User';
import { MentoringService } from 'src/app/services/mentorings/mentoring.service';
import { UserService } from 'src/app/services/users/user.service';

interface Data extends Teacher {
  mentorings: Mentoring[]
}

@Component({
  selector: 'app-month-hours',
  templateUrl: './month-hours.component.html',
  styleUrls: ['./month-hours.component.css']
})
export class MonthHoursComponent {
  displayedColumns = ['teachers', 'groups', 'mentorings']
  teachers: MatTableDataSource<Data> = new MatTableDataSource<Data>()

  //TODO: FIX THIS

  constructor(
    private userService: UserService,
    private mentoringService: MentoringService) {

  }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        res.forEach((user: User) => {
          if (user.role === 'TEACHER') {
            this.getTeacherById(user.id)
          }
        })
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  getTeacherById(id: string) {
    this.userService.getTeacherById(id).subscribe({
      next: (res) => {
        this.getMentoringsByTeacherId(res.id, res)
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  getMentoringsByTeacherId(teacherId: string, teacher: Teacher) {
    this.mentoringService.getMentoringByTeacherId(teacherId).subscribe({
      next: (res) => {
        this.teachers.data.push({ ...teacher, mentorings: res })
        this.teachers._updateChangeSubscription()
        console.log({ teachers: this.teachers.data })
      },
      error: (error) => {
        console.error(error)
      }
    })
  }
}
