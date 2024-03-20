import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/global-vars/global';
import { User } from 'src/app/models/users/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${Constants.BASE_URL}api/user`, {headers: Constants.headers});
  }

  createNewUser(user: User): Observable<User> {
    return this.http.post<User>(`${Constants.BASE_URL}api/user/new-user`, user, {headers: Constants.headers});
  }
}
