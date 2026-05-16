import { Component, OnDestroy, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeService } from '../../../services/trade.service';
import { Trade } from '../../../models/trade.models';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trade-feed',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './trade-feed.component.html',
  styleUrl: './trade-feed.component.scss'
})
export class TradeFeedComponent implements OnInit, OnDestroy, OnChanges {
  @Input() symbol: string = 'RELIANCE.NS';
  trades: Trade[] = [];
  private tradeSub?: Subscription;

  constructor(private tradeService: TradeService) {}

  ngOnInit() {
    this.subscribeToTrades();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['symbol'] && !changes['symbol'].firstChange) {
      this.subscribeToTrades();
    }
  }

  private subscribeToTrades() {
    if (this.tradeSub) {
      this.tradeSub.unsubscribe();
      this.tradeService.unsubscribe(this.symbol); // Note: this might need logic to track old symbol
    }

    this.trades = []; // Clear old trades
    this.tradeSub = this.tradeService.subscribeToTrades(this.symbol).subscribe({
      next: (trade) => {
        this.trades = [trade, ...this.trades].slice(0, 50);
      },
      error: (err) => console.error('WebSocket error:', err)
    });
  }

  ngOnDestroy() {
    this.tradeSub?.unsubscribe();
    this.tradeService.unsubscribe(this.symbol);
  }
}
