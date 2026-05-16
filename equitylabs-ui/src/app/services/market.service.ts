import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total?: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private apiUrl = `${environment.engineUrl}/api/market`;

  constructor(private http: HttpClient) {}

  getOrderBook(symbol: string): Observable<OrderBook> {
    return this.http.get<OrderBook>(`${this.apiUrl}/${symbol}/orderbook`);
  }
}
