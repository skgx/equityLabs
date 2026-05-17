import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AiService } from '../../services/ai.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressBarModule, RouterLink],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
  @Input() symbol: string = 'RELIANCE.NS';
  private aiService = inject(AiService);
  authService = inject(AuthService);

  summary = signal<string>('');
  suggestion = signal<string>('');
  isLoading = signal<boolean>(false);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.runFullAnalysis();
    }
  }

  runFullAnalysis() {
    this.isLoading.set(true);
    this.summary.set('');
    this.suggestion.set('');

    this.aiService.getMarketSummary(this.symbol).subscribe({
      next: (res) => {
        this.summary.set(res);
        this.checkLoading();
      },
      error: () => this.checkLoading()
    });

    this.aiService.suggestPrice(this.symbol, 'BUY').subscribe({
      next: (res) => {
        this.suggestion.set(res);
        this.checkLoading();
      },
      error: () => this.checkLoading()
    });
  }

  private checkLoading() {
    if (this.summary() && this.suggestion()) {
      this.isLoading.set(false);
    }
  }
}
