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
    return this.http.get<Group[]>(`${Constants.BASE_URL}api/groups`, {headers: Constants.headers});
  }

  createNewGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(`${Constants.BASE_URL}api/groups`, group, {headers: Constants.headers});
  }

}
