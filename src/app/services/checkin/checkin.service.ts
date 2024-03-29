import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/global-vars/global';
import { Checkin } from 'src/app/models/checkin/Checkin';
import { CheckinDTO } from 'src/app/models/checkin/CheckinDTO';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {

  private httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  checkin(checkin: Checkin): Observable<Checkin> {
    return this.http.post<Checkin>(`${Constants.BASE_URL}api/check-in/new`, checkin, {headers: this.httpHeaders});
  }

  getCheckIn(): Observable<CheckinDTO[]> {
    return this.http.get<CheckinDTO[]>(`${Constants.BASE_URL}api/check-in`);
  }
}
