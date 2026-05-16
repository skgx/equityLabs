import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { TickerService, TickerItem } from '../../services/ticker.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-ticker-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticker-bar.component.html',
  styleUrls: ['./ticker-bar.component.scss']
})
export class TickerBarComponent implements OnInit {
  private tickerService = inject(TickerService);
  private router = inject(Router);

  tickerData = this.tickerService.tickerData;
  pauseScroll = false;
  
  currentUrl = signal('');
  showTicker = computed(() => this.currentUrl() !== '/auth');

  ngOnInit() {
    // Initial fetch
    this.tickerService.fetchTickerData().subscribe();

    // Track route changes to hide/show ticker
    this.currentUrl.set(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }
}
