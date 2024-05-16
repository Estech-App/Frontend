import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupDTO } from 'src/app/models/group/GroupDTO';
import { Constants } from 'src/app/global-vars/global';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  getGroups(): Observable<GroupDTO[]> {
    return this.http.get<GroupDTO[]>(`${Constants.BASE_URL}api/group`, {headers: Constants.headers});
  }
}
