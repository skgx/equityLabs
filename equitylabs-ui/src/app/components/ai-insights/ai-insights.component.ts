import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="analytics-shell">
      <div class="page-header">
        <div class="title-group">
          <h1>GEMINI <span class="accent">ANALYTICS</span></h1>
          <p>Real-time AI surveillance and market intelligence</p>
        </div>
        <button mat-flat-button color="primary" (click)="refreshAll()">
          <mat-icon>refresh</mat-icon> REFRESH ALL
        </button>
      </div>

      <div class="analytics-grid">
        <!-- Market Summary Panel -->
        <div class="analytics-panel">
          <div class="panel-head">
            <mat-icon>article</mat-icon> MARKET SUMMARY: {{ currentSymbol }}
          </div>
          <div class="panel-content">
            <div class="terminal-text">{{ marketSummary || 'Streaming analysis from Gemini...' }}</div>
          </div>
        </div>

        <!-- Price Strategy Panel -->
        <div class="analytics-panel">
          <div class="panel-head">
            <mat-icon>query_stats</mat-icon> EXECUTION STRATEGY: BUY
          </div>
          <div class="panel-content">
            <div class="terminal-text highlight-box">{{ priceSuggestion || 'Calculating optimal entry price...' }}</div>
          </div>
        </div>

        <!-- Anomaly Detection Panel -->
        <div class="analytics-panel wide">
          <div class="panel-head">
            <mat-icon>security</mat-icon> SURVEILLANCE FEED
          </div>
          <div class="panel-content feed">
            <div class="feed-item normal">
              <span class="timestamp mono">[17:40:12]</span>
              <span class="msg">System status: NOMINAL. All trades within 1.5% deviation.</span>
            </div>
            <div class="feed-item info">
              <span class="timestamp mono">[17:38:05]</span>
              <span class="msg">Volume spike detected in TSLA (2.4x average). Gemini analyzing...</span>
            </div>
            <div class="feed-item normal">
              <span class="timestamp mono">[17:35:00]</span>
              <span class="msg">Market summary generated for {{ currentSymbol }}. Sentiment: BULLISH.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-shell {
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;

      h1 {
        font-size: 28px;
        font-weight: 800;
        margin: 0;
        color: var(--text-primary);
        .accent { color: var(--accent-blue); }
      }

      p {
        margin: 5px 0 0;
        color: var(--text-secondary);
        font-size: 14px;
      }
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
    }

    .analytics-panel {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      display: flex;
      flex-direction: column;

      &.wide { grid-column: span 2; }

      .panel-head {
        padding: 12px 20px;
        background: var(--bg-tertiary);
        border-bottom: 1px solid var(--border-color);
        font-size: 11px;
        font-weight: 700;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 10px;
        mat-icon { font-size: 18px; width: 18px; height: 18px; }
      }

      .panel-content {
        padding: 25px;
        flex: 1;

        .terminal-text {
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-primary);
        }

        .highlight-box {
          color: var(--accent-blue);
          border-left: 3px solid var(--accent-blue);
          padding-left: 15px;
        }

        &.feed {
          padding: 15px 25px;
          max-height: 300px;
          overflow-y: auto;
        }
      }
    }

    .feed-item {
      padding: 10px 0;
      border-bottom: 1px solid var(--border-color);
      font-family: var(--font-mono);
      font-size: 12px;
      display: flex;
      gap: 15px;

      &:last-child { border-bottom: none; }

      .timestamp { color: var(--text-secondary); }
      &.normal .msg { color: var(--text-primary); }
      &.info .msg { color: var(--accent-blue); }
    }
  `]
})
export class AiInsightsComponent implements OnInit {
  currentSymbol: string = 'RELIANCE.NS';
  marketSummary: string = '';
  priceSuggestion: string = '';

  constructor(private aiService: AiService) {}

  ngOnInit() {
    this.refreshAll();
  }

  refreshAll() {
    this.loadSummary();
    this.loadSuggestion();
  }

  loadSummary() {
    this.aiService.getMarketSummary(this.currentSymbol).subscribe(res => this.marketSummary = res);
  }

  loadSuggestion() {
    this.aiService.suggestPrice(this.currentSymbol, 'BUY').subscribe(res => this.priceSuggestion = res);
  }
}
