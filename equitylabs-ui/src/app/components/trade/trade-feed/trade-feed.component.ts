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
  trades: any[] = [];
  private tradeSub?: Subscription;
  private readonly CURRENT_USER = 'demo-user';

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
      this.tradeService.unsubscribe(this.symbol);
    }

    this.trades = []; 
    this.tradeSub = this.tradeService.subscribeToTrades(this.symbol).subscribe({
      next: (trade) => {
        console.log('Trade received:', trade);
        const newEntries: any[] = [];

        // Logic: If user is buyer, add a BUY entry. If user is seller, add a SELL entry.
        // If user is both (self-match), they will see both entries as requested.
        // If user is neither, add a generic TRADE entry.

        if (trade.buyUserId === this.CURRENT_USER) {
          newEntries.push({ ...trade, displaySide: 'BUY' });
        }
        if (trade.sellUserId === this.CURRENT_USER) {
          newEntries.push({ ...trade, displaySide: 'SELL' });
        }
        
        if (trade.buyUserId !== this.CURRENT_USER && trade.sellUserId !== this.CURRENT_USER) {
          newEntries.push({ ...trade, displaySide: 'TRADE' });
        }

        this.trades = [...newEntries, ...this.trades].slice(0, 50);
      },
      error: (err) => console.error('WebSocket error:', err)
    });
  }

  ngOnDestroy() {
    this.tradeSub?.unsubscribe();
    this.tradeService.unsubscribe(this.symbol);
  }
}
