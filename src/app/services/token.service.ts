import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenResponse } from '../models/TokenResponse';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/LoginModel';
import { Constants } from '../global-vars/global';
import { UserInfo } from '../models/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  login(login: LoginModel): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${Constants.BASE_URL}login`, login, { headers: this.httpHeaders })
  }

  userInfo(email: string): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${Constants.BASE_URL}api/user/user-info`, {"email": email}, { headers: this.httpHeaders })
  }
}
