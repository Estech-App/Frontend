import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/global-vars/global';
import { Group } from 'src/app/models/groups/Group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${Constants.BASE_URL}api/group`, { headers: Constants.headers });
  }

  createNewGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(`${Constants.BASE_URL}api/group`, group, { headers: Constants.headers });
  }

  updateGroup(group: Group): Observable<Group> {
    return this.http.put<Group>(`${Constants.BASE_URL}api/group`, group, { headers: Constants.headers });
  }

  grtGroupById(id: string): Observable<Group> {
    return this.http.get<Group>(`${Constants.BASE_URL}api/group/${id}`, { headers: Constants.headers });
  }

  getGroupByUserId(id: string): Observable<Group> {
    return this.http.get<Group>(`${Constants.BASE_URL}api/group/by-user/${id}`, { headers: Constants.headers });
  }

}
