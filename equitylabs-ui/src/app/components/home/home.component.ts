import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { TickerService } from '../../services/ticker.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  private tickerService = inject(TickerService);
  private router = inject(Router);

  watchlist = this.tickerService.tickerData;

  ngOnInit() {
    this.tickerService.fetchTickerData().subscribe();
  }

  selectStock(symbol: string) {
    // Navigate to markets and pass symbol as query param
    this.router.navigate(['/markets'], { queryParams: { symbol } });
  }
}
