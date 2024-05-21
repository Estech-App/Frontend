import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/global-vars/global';
import { Mentoring } from 'src/app/models/mentorings/Mentoring';

@Injectable({
  providedIn: 'root'
})
export class MentoringService {

  constructor(private http: HttpClient) { }

  getMentorings(): Observable<Mentoring[]> {
    return this.http.get<Mentoring[]>(`${Constants.BASE_URL}api/mentoring`, {headers: Constants.headers});
  }

  getMentoringsByRoomId(roomId: Number): Observable<Mentoring[]> {
    return this.http.get<Mentoring[]>(`${Constants.BASE_URL}api/mentoring/by-room/${roomId}`, {headers: Constants.headers});
  }

}
