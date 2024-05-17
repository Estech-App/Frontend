import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/global-vars/global';
import { FreeUsage } from 'src/app/models/freeUsages/freeUsage';

@Injectable({
  providedIn: 'root'
})
export class FreeUsageService {

  constructor(private http: HttpClient) { }

  getFreeUsages(): Observable<FreeUsage[]> {
    return this.http.get<FreeUsage[]>(`${Constants.BASE_URL}api/free-usage`, {headers: Constants.headers});
  }

  createFreeUsage(freeUsage: FreeUsage): Observable<FreeUsage> {
    return this.http.post<FreeUsage>(`${Constants.BASE_URL}api/free-usage`, freeUsage, {headers: Constants.headers});
  }

  updateFreeUsage(freeUsage: FreeUsage): Observable<FreeUsage> {
    return this.http.put<FreeUsage>(`${Constants.BASE_URL}api/free-usage`, freeUsage, {headers: Constants.headers});
  }
}
