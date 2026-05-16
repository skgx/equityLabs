import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ExplainOrderRequest, ExplainOrderResponse } from '../models/trade.models';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/api/ai`;

  constructor(private http: HttpClient) {}

  explainOrder(request: ExplainOrderRequest): Observable<ExplainOrderResponse> {
    return this.http.post<ExplainOrderResponse>(`${this.apiUrl}/explain-order`, request);
  }

  getMarketSummary(symbol: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/market-summary/${symbol}`, { responseType: 'text' });
  }

  suggestPrice(symbol: string, side: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/suggest-price/${symbol}/${side}`, { responseType: 'text' });
  }
}
