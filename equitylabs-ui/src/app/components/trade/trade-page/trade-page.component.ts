import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderBookComponent } from '../order-book/order-book.component';
import { TradeFeedComponent } from '../trade-feed/trade-feed.component';
import { StockChartComponent } from '../../stock-chart/stock-chart.component';
import { TickerService, TickerItem } from '../../../services/ticker.service';

@Component({
  selector: 'app-trade-page',
  standalone: true,
  imports: [CommonModule, OrderFormComponent, OrderBookComponent, TradeFeedComponent, StockChartComponent],
  templateUrl: './trade-page.component.html',
  styleUrl: './trade-page.component.scss'
})
export class TradePageComponent implements OnInit {
  private tickerService = inject(TickerService);

  // Use the signal from tickerService
  watchlist = this.tickerService.tickerData;
  selectedSymbol = 'RELIANCE.NS';
  
  // Timeframe selection logic
  selectedInterval = signal<string>('5m');
  selectedRange = signal<string>('1d');

  timeframes = [
    { label: '1m', interval: '1m', range: '1d' },
    { label: '5m', interval: '5m', range: '1d' },
    { label: '15m', interval: '15m', range: '1d' },
    { label: '1h', interval: '60m', range: '1d' },
    { label: '1d', interval: '1d', range: '1mo' }
  ];

  ngOnInit() {
    this.tickerService.fetchTickerData().subscribe();
  }

  selectStock(symbol: string) {
    this.selectedSymbol = symbol;
  }

  selectTimeframe(tf: any) {
    this.selectedInterval.set(tf.interval);
    this.selectedRange.set(tf.range);
  }

  getSelectedStock() {
    return this.watchlist().find(s => s.symbol === this.selectedSymbol) || this.watchlist()[0];
  }
}
