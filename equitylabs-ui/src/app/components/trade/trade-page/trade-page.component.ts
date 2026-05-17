import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderBookComponent } from '../order-book/order-book.component';
import { TradeFeedComponent } from '../trade-feed/trade-feed.component';
import { StockChartComponent } from '../../stock-chart/stock-chart.component';
import { TickerService } from '../../../services/ticker.service';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trade-page',
  standalone: true,
  imports: [
    CommonModule, 
    OrderFormComponent, 
    OrderBookComponent, 
    TradeFeedComponent, 
    StockChartComponent,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './trade-page.component.html',
  styleUrl: './trade-page.component.scss'
})
export class TradePageComponent implements OnInit {
  private tickerService = inject(TickerService);
  authService = inject(AuthService);

  watchlist = this.tickerService.tickerData;
  selectedSymbol = 'RELIANCE.NS';
  
  selectedInterval = signal<string>('5m');
  selectedRange = signal<string>('1d');

  // Dynamic layout state
  executionWidth = signal<number>(340);
  terminalHeight = signal<number>(300);
  isDraggingHorizontal = false;
  isDraggingVertical = false;

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

  // --- Drag Handling Logic ---

  startHorizontalDrag(event: MouseEvent) {
    event.preventDefault();
    this.isDraggingHorizontal = true;
    document.body.style.cursor = 'col-resize';
  }

  startVerticalDrag(event: MouseEvent) {
    event.preventDefault();
    this.isDraggingVertical = true;
    document.body.style.cursor = 'row-resize';
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDraggingHorizontal) {
      const newWidth = window.innerWidth - event.clientX;
      if (newWidth > 280 && newWidth < 600) {
        this.executionWidth.set(newWidth);
      }
    } else if (this.isDraggingVertical) {
      const layoutTop = 110; 
      const containerHeight = window.innerHeight - layoutTop;
      const newHeight = containerHeight - (event.clientY - layoutTop);
      if (newHeight > 150 && newHeight < 600) {
        this.terminalHeight.set(newHeight);
      }
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDraggingHorizontal = false;
    this.isDraggingVertical = false;
    document.body.style.cursor = 'default';
  }
}
