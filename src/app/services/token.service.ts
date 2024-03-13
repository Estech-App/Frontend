import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenResponse } from '../models/TokenResponse';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/LoginModel';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  login(login: LoginModel): Observable<TokenResponse> {
    return this.http.post<TokenResponse>("http://localhost:8080/login", login, { headers: this.httpHeaders })
  }
}
