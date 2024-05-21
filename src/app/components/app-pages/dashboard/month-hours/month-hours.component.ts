import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/users/User';
import { CheckinService } from 'src/app/services/checkin/checkin.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-month-hours',
  templateUrl: './month-hours.component.html',
  styleUrls: ['./month-hours.component.css']
})
export class MonthHoursComponent {
  displayedColumns = ['name', 'school', 'mentoring', 'total']
  teachers: MatTableDataSource<User> = new MatTableDataSource<User>()

  constructor(private userService: UserService, private checkinsService: CheckinService) {
    this.getTeachers()
  }

  getTeachers() {
    this.userService.getUsers().subscribe({
      next: (teachers) => {
        this.teachers.data = teachers.filter(teacher => teacher.role === 'TEACHER')
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  // getCheckinHours(teacher: User) {
  //   this.checkinsService.getCheckinByUserId(teacher.id).subscribe({
  //     next: (checkins) => {
  //       teacher.checkins = checkins.reduce((acc, checkin) => acc + checkin.hours, 0)
  //     },
  //     error: (error) => {
  //       console.error(error)
  //     }
  //   })
  // }

  // getMentoringHours() {
  //   this.checkinsService.getMentoring().subscribe({
  //     next: (mentoring) => {
  //       teacher.mentoring = mentoring.reduce((acc, mentoring) => acc + mentoring.hours, 0)
  //     },
  //     error: (error) => {
  //       console.error(error)
  //     }
  //   })
  // }

  // calculateTotalHours(teacher: User) {
  //   teacher.total = teacher.checkins + teacher.mentoring
  // }

}
