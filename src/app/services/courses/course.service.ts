import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/global-vars/global';
import { Course } from 'src/app/models/courses/Course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${Constants.BASE_URL}api/course`, { headers: Constants.headers });
  }

  createNewCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${Constants.BASE_URL}api/course/new-course`, course, { headers: Constants.headers });
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${Constants.BASE_URL}api/course/${id}`, { headers: Constants.headers })
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${Constants.BASE_URL}api/course/update-course`, course, { headers: Constants.headers })
  }

  deleteCourse(id: number): Observable<Course> {
    return this.http.delete<Course>(`${Constants.BASE_URL}api/course/${id}`, { headers: Constants.headers })
  }

}
