import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/global-vars/global';
import { ModuleCreationDTO } from 'src/app/models/module/ModuleCreationDTO';
import { ModuleDTO } from 'src/app/models/module/ModuleDTO';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private http: HttpClient) { }

  getAllModules(): Observable<ModuleDTO[]> {
    return this.http.get<ModuleDTO[]>(`${Constants.BASE_URL}api/module`, {headers: Constants.headers});
  }

  createNewModule(module: ModuleCreationDTO): Observable<ModuleDTO> {
	return this.http.post<ModuleDTO>(`${Constants.BASE_URL}api/module/new-module`, module, {headers: Constants.headers});
  }

}
