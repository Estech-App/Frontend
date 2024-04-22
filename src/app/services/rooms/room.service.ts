import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/global-vars/global';
import { Room } from 'src/app/models/rooms/Room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${Constants.BASE_URL}api/check-in/new`, room, {headers: Constants.headers});
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${Constants.BASE_URL}api/check-in`);
  }

  updateRoom(room: Room): Observable<Room> {
    return this.http.put<Room>(`${Constants.BASE_URL}api/check-in/update-checkin`, room, {headers: Constants.headers});
  }
}