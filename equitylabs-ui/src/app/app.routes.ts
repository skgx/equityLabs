import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MarketsComponent } from './components/markets/markets.component';
import { TradePageComponent } from './components/trade/trade-page/trade-page.component';
import { AuthComponent } from './components/auth/auth.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    { path: 'home', component: HomeComponent },
    { path: 'terminal', component: TradePageComponent, canActivate: [authGuard] },
    { path: 'markets', component: MarketsComponent, canActivate: [authGuard] },
    { path: 'portfolio', component: PortfolioComponent, canActivate: [authGuard] },
    { path: 'analytics', component: AnalyticsComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'home' }
];
