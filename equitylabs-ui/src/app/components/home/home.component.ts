import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TickerService, TickerItem } from '../../services/ticker.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatDividerModule, 
    MatIconModule, 
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  marketData = signal<TickerItem[]>([]);
  isLoading = signal<boolean>(true);

  private readonly displaySymbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'NIFTY 50'];

  constructor(private tickerService: TickerService) {}

  ngOnInit(): void {
    this.tickerService.fetchTickerData().subscribe({
      next: (data) => {
        const filtered = data.filter(item => this.displaySymbols.includes(item.displayName));
        // Sort to match the requested order
        const sorted = this.displaySymbols
          .map(sym => filtered.find(f => f.displayName === sym))
          .filter((item): item is TickerItem => !!item);
        
        this.marketData.set(sorted);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching market data', err);
        this.isLoading.set(false);
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatPercent(value: number): string {
    return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
  }
}
