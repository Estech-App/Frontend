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
  displayedColumns = ['name', 'acronym', 'n-groups', 'edit'];
  form: FormGroup
  name = ''
  acronym = ''
  post = true

  constructor(
    private courseService: CourseService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getAllCourses()
    this.form = this.formBuilder.group({
      id: '',
      name: '',
      acronym: ''
    })
  }

  createNewCourse(): void {
    let course: Course = {
      id: null,
      name: this.form.get('name')?.value,
      acronym: this.form.get('acronym')?.value,
      description: ''
    }

    this.courseService.createNewCourse(course).subscribe({
      next: res => {
        this.getAllCourses()
        this.form.setValue({ id: '', name: '', acronym: '' })
        location.reload()
      }, error: err => {
        console.log(err);
      }
    })

    this.name = ''
    this.acronym = ''
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

  getCourseById(id: number) {
    this.courseService.getCourseById(id).subscribe({
      next: res => {
        this.form.setValue({
          id: res.id,
          name: res.name,
          acronym: res.acronym
        })
      }, error: err => {
        console.log(err);
      }
    })
    this.post = false
  }

  updateCourse() {
    let course: Course = {
      id: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
      acronym: this.form.get('acronym')?.value,
      description: ''
    }

    this.courseService.updateCourse(course).subscribe({
      next: res => {
        this.getAllCourses()
        this.form.reset()
        this.post = true
        location.reload()
      }, error: err => {
        console.log(err);
      }
    })
  }

  deleteCourse(course: Course) {
    let id: number = Number(course.id)
    if (confirm(`Vas a eliminar el CURSO llamado ${course.name}. ¿Estás seguro?`)) {
      this.courseService.deleteCourse(id).subscribe({
        next: res => {
          window.location.reload()
        }, error: err => {
          console.log(err);
        }
      })
    }
  }

}
