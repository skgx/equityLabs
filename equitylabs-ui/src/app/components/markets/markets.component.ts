import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerService, TickerItem } from '../../services/ticker.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StockChartComponent } from '../stock-chart/stock-chart.component';

@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, StockChartComponent],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss'
})
export class MarketsComponent implements OnInit {
  private tickerService = inject(TickerService);

  // Top Indian symbols to display
  symbols = [
    { symbol: 'RELIANCE.NS', name: 'RELIANCE' },
    { symbol: 'TCS.NS', name: 'TCS' },
    { symbol: 'INFY.NS', name: 'INFY' },
    { symbol: 'HDFCBANK.NS', name: 'HDFCBANK' },
    { symbol: 'ICICIBANK.NS', name: 'ICICIBANK' },
    { symbol: 'SBIN.NS', name: 'SBIN' },
    { symbol: '^NSEI', name: 'NIFTY 50' },
    { symbol: '^BSESN', name: 'SENSEX' }
  ];

  selectedSymbol = signal<string>('RELIANCE.NS');
  selectedRange = signal<string>('1mo');
  selectedInterval = signal<string>('1d');
  
  // Use the signal from tickerService
  marketItems = this.tickerService.tickerData;

  ranges = [
    { label: '1d', range: '1d', interval: '5m' },
    { label: '5d', range: '5d', interval: '15m' },
    { label: '1mo', range: '1mo', interval: '1d' },
    { label: '1y', range: '1y', interval: '1d' }
  ];

  ngOnInit(): void {
    this.tickerService.fetchTickerData().subscribe();
  }

  selectSymbol(symbol: string) {
    this.selectedSymbol.set(symbol);
  }

  selectRange(range: string) {
    const rangeObj = this.ranges.find(r => r.range === range);
    if (rangeObj) {
      this.selectedRange.set(rangeObj.range);
      this.selectedInterval.set(rangeObj.interval);
    }
  }

  getSelectedStockData(): TickerItem | undefined {
    return this.marketItems().find(item => item.symbol === this.selectedSymbol());
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}

