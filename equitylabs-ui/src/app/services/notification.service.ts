import { Injectable, inject } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { Order } from '../models/trade.models';
import { retry, delay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  init() {
    const wsUrl = `${environment.wsUrl}/ws/orders`;
    console.log('Initializing Notification WebSocket at:', wsUrl);
    
    webSocket<Order>(wsUrl).pipe(
      tap(msg => console.log('Notification received:', msg)),
      retry({ count: 20, delay: 5000 })
    ).subscribe({
      next: (order) => {
        if (order && order.status === 'FILLED') {
          console.log('Order FILLED detected, showing toast...');
          this.showOrderFilledToast(order);
        }
      },
      error: (err) => console.error('Notification WS error:', err)
    });
  }

  private showOrderFilledToast(order: Order) {
    this.snackBar.open(
      `ORDER FILLED: ${order.quantity} units of ${order.symbol} @ ${order.price}`,
      'Dismiss',
      {
        duration: 8000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['filled-toast']
      }
    );
  }
}
