import { Injectable } from '@angular/core';
import { Stock } from '../../models/stock/Stock';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../global-vars/global';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient) { }

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${Constants.BASE_URL}api/stock`, { headers: Constants.headers });
  }

  getStockByRoomId(roomId: number): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${Constants.BASE_URL}api/stock/by-room/${roomId}`, { headers: Constants.headers });
  }

  addStockToRoom(stock: Stock) {
    return this.http.post(`${Constants.BASE_URL}api/stock`, stock, { headers: Constants.headers });
  }

  updateStock(stock: Stock) {
    return this.http.put(`${Constants.BASE_URL}api/stock`, stock, { headers: Constants.headers });
  }

  removeStock(stockId: number) {
    return this.http.delete(`${Constants.BASE_URL}api/stock/${stockId}`, { headers: Constants.headers });
  }
}
