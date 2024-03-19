import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/courses/Course';
import { CourseService } from 'src/app/services/courses/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {

  courses: Course[] = []
  displayedColumns = ['name', 'acronym', 'n-groups'];
  form: FormGroup
  name = ''
  acronym = ''

  constructor(
    private courseService: CourseService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getAllCourses()
    this.form = this.formBuilder.group({
      name: '',
      acronym: ''
    })
  }

  createNewCourse(): void {
    let course: Course = {
      name: this.form.get('name')?.value,
      acronym: this.form.get('acronym')?.value,
      description: ''
    }

    this.courseService.createNewCourse(course).subscribe({
      next: res => {
        this.getAllCourses()
        this.form.setValue({name: '', acronym: ''})
      }, error: err => {
        console.log(err);
      }
    })
  }

  getAllCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: res => {
        this.courses = res;
      }, error: err => {
        console.log(err);
      }
    })
  }

}
