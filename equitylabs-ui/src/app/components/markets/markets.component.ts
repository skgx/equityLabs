import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TickerService, TickerItem } from '../../services/ticker.service';
import { StockChartComponent } from '../stock-chart/stock-chart.component';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, StockChartComponent, RouterLink],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss'
})
export class MarketsComponent implements OnInit {
  private tickerService = inject(TickerService);
  authService = inject(AuthService);

  marketItems = this.tickerService.tickerData;
  selectedSymbol = signal<string>('RELIANCE.NS');
  selectedRange = signal<string>('1mo');
  selectedInterval = signal<string>('1d');

  ranges = [
    { label: '1D', range: '1d', interval: '5m' },
    { label: '1W', range: '5d', interval: '15m' },
    { label: '1M', range: '1mo', interval: '1d' },
    { label: '1Y', range: '1y', interval: '1wk' },
    { label: 'ALL', range: 'max', interval: '1mo' }
  ];

  ngOnInit() {
    this.tickerService.fetchTickerData().subscribe();
  }

  selectSymbol(symbol: string) {
    this.selectedSymbol.set(symbol);
  }

  selectRange(range: string) {
    this.selectedRange.set(range);
    const r = this.ranges.find(x => x.range === range);
    if (r) this.selectedInterval.set(r.interval);
  }

  getSelectedStockData() {
    return this.marketItems().find(item => item.symbol === this.selectedSymbol());
  }

  formatCurrency(value: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  }
}
