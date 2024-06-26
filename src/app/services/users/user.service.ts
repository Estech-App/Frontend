import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/global-vars/global';
import { Student } from 'src/app/models/users/Student';
import { Teacher } from 'src/app/models/users/Teacher';
import { User } from 'src/app/models/users/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${Constants.BASE_URL}api/user`, { headers: Constants.headers });
  }

  createNewUser(user: User): Observable<User> {
    return this.http.post<User>(`${Constants.BASE_URL}api/user/new-user`, user, { headers: Constants.headers });
  }

  createNewStudent(user: Student): Observable<Student> {
    return this.http.post<Student>(`${Constants.BASE_URL}api/user/new-user/student`, user, { headers: Constants.headers });
  }

  createNewTeacher(user: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(`${Constants.BASE_URL}api/user/new-user/teacher`, user, { headers: Constants.headers });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${Constants.BASE_URL}api/user/${id}`, { headers: Constants.headers });
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${Constants.BASE_URL}api/user/student/${id}`, { headers: Constants.headers });
  }

  getTeacherById(id: string): Observable<Teacher> {
    return this.http.get<Teacher>(`${Constants.BASE_URL}api/user/teacher/${id}`, { headers: Constants.headers });
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${Constants.BASE_URL}api/user/update-user`, user, { headers: Constants.headers });
  }

  updateStudent(user: Student): Observable<Student> {
    return this.http.put<Student>(`${Constants.BASE_URL}api/user/update-student`, user, { headers: Constants.headers });
  }

  updateTeacher(user: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(`${Constants.BASE_URL}api/user/update-teacher`, user, { headers: Constants.headers });
  }

  getByRoleId(roleId: number): Observable<User[]> {
    return this.http.get<User[]>(`${Constants.BASE_URL}api/user/find-by-role/${roleId}`, { headers: Constants.headers });
  }

  deleteUser(id: string): Observable<User> {
    return this.http.delete<User>(`${Constants.BASE_URL}api/user/${id}`, { headers: Constants.headers });
  }
}
