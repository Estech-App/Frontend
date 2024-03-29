import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenResponse } from '../../models/login/TokenResponse';
import { Observable } from 'rxjs';
import { LoginModel } from '../../models/login/LoginModel';
import { Constants } from '../../global-vars/global';
import { UserInfo } from '../../models/login/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

  login(login: LoginModel): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${Constants.BASE_URL}login`, login, {headers: Constants.headers})
  }

  userInfo(email: string): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${Constants.BASE_URL}api/user/user-info`, {"email": email}, {headers: Constants.headers})
  }
}
