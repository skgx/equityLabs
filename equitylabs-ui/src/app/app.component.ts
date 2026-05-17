import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { TickerBarComponent } from './components/ticker-bar/ticker-bar.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    MatToolbarModule, 
    MatButtonModule,
    MatIconModule,
    TickerBarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'EquityLabs';
  marketStatus = 'LIVE';
  authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  // Track the current route to hide navbar/ticker on /auth
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects)
    )
  );

  isAuthPage = computed(() => this.currentUrl()?.includes('/auth'));

  constructor() {
    this.notificationService.init();
  }

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return 'U';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.fullName[0].toUpperCase();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
