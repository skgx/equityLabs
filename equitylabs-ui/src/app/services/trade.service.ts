import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, retry, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Trade } from '../models/trade.models';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private sockets: Map<string, WebSocketSubject<any>> = new Map();

  subscribeToTrades(symbol: string): Observable<Trade> {
    const wsUrl = `${environment.wsUrl}/ws/trades/${symbol}`;

    if (!this.sockets.has(symbol)) {
      this.sockets.set(symbol, webSocket(wsUrl));
    }

    return this.sockets.get(symbol)!.pipe(
      retry({ count: 5, delay: 2000 })
    );
  }

  unsubscribe(symbol: string): void {
    const socket = this.sockets.get(symbol);
    if (socket) {
      socket.complete();
      this.sockets.delete(symbol);
    }
  }
}
