import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/users/User';
import { CourseService } from 'src/app/services/courses/course.service';
import { GroupService } from 'src/app/services/groups/group.service';
import { ModuleService } from 'src/app/services/module/module.service';
import { UserService } from 'src/app/services/users/user.service';

interface MiscData {
  courses: number
  groups: number
  modules: number
  students: number
  teachers: number
}

@Component({
  selector: 'app-month-hours',
  templateUrl: './month-hours.component.html',
  styleUrls: ['./month-hours.component.css']
})
export class MonthHoursComponent {
  displayedColumns = ['courses', 'groups', 'modules', 'students', 'teachers']
  data: MatTableDataSource<MiscData> = new MatTableDataSource<MiscData>()

  //TODO: FIX THIS

  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private groupService: GroupService,
    private moduleService: ModuleService) {

  }

  ngOnInit(): void {
    this.getUsers()
    this.getCourses()
    this.getGroups()
    this.getModules()
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        const teachers = res.filter((user: User) => user.role === 'TEACHER')
        const students = res.filter((user: User) => user.role === 'STUDENT')
        this.data.data[0].teachers = teachers.length
        this.data.data[0].students = students.length
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  getCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (res) => {
        this.data.data[0].courses = res.length
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  getGroups() {
    this.groupService.getAllGroups().subscribe({
      next: (res) => {
        this.data.data[0].groups = res.length
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  getModules() {
    this.moduleService.getAllModules().subscribe({
      next: (res) => {
        this.data.data[0].modules = res.length
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

}
