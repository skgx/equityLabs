import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService, OrderBook } from '../../../services/market.service';
import { interval, Subscription, switchMap, startWith, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-order-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-book.component.html',
  styleUrl: './order-book.component.scss'
})
export class OrderBookComponent implements OnInit, OnDestroy, OnChanges {
  @Input() symbol: string = 'RELIANCE.NS';
  orderBook?: OrderBook;
  maxQty: number = 1;
  spread: number = 0;
  midPrice: number = 1;
  private pollSub?: Subscription;

  constructor(private marketService: MarketService) {}

  ngOnInit() {
    this.startPolling();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['symbol'] && !changes['symbol'].firstChange) {
      this.startPolling();
    }
  }

  private startPolling() {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
    }

    this.pollSub = interval(3000).pipe(
      startWith(0),
      switchMap(() => this.marketService.getOrderBook(this.symbol).pipe(
        catchError(() => of(this.generateMockOrderBook(this.symbol)))
      ))
    ).subscribe({
      next: (book) => {
        this.orderBook = book;
        this.calculateMetrics();
      },
      error: (err) => console.error('Order book error:', err)
    });
  }

  private calculateMetrics() {
    if (!this.orderBook) return;

    const allEntries = [...this.orderBook.bids, ...this.orderBook.asks];
    this.maxQty = Math.max(...allEntries.map(e => e.quantity), 1);

    if (this.orderBook.bids.length > 0 && this.orderBook.asks.length > 0) {
      const topBid = this.orderBook.bids[0].price;
      const topAsk = this.orderBook.asks[0].price;
      this.spread = topAsk - topBid;
      this.midPrice = (topAsk + topBid) / 2;
    }
  }

  private generateMockOrderBook(symbol: string): OrderBook {
    // Fallback mock data if matching engine is not reachable
    const basePrice = symbol.includes('RELIANCE') ? 2950 : 1500;
    const bids = [];
    const asks = [];
    
    for (let i = 0; i < 10; i++) {
      bids.push({ price: basePrice - (i * 0.5) - 0.2, quantity: Math.floor(Math.random() * 500) + 100 });
      asks.push({ price: basePrice + (i * 0.5) + 0.2, quantity: Math.floor(Math.random() * 500) + 100 });
    }
    
    return { symbol, bids, asks };
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }
}
