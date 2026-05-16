import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatButtonModule, MatIconModule],
  template: `
    <div class="profile-container">
      <div class="profile-card" *ngIf="authService.currentUser() as user">
        <div class="header">
          <div class="avatar">{{ user.fullName[0] }}</div>
          <div class="info">
            <h1>{{ user.fullName }}</h1>
            <p>&#64;{{ user.username }}</p>
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="details">
          <div class="detail-item">
            <span class="label">Email Address</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="detail-item">
            <span class="label">User ID</span>
            <span class="value mono">{{ user.userId }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Account Status</span>
            <span class="value positive">VERIFIED</span>
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="actions">
          <button mat-stroked-button color="warn" (click)="authService.logout()">
            <mat-icon>logout</mat-icon> LOGOUT
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 40px;
      display: flex;
      justify-content: center;
    }

    .profile-card {
      width: 100%;
      max-width: 600px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 40px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 25px;
      margin-bottom: 30px;

      .avatar {
        width: 80px;
        height: 80px;
        background: var(--accent-blue);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: 800;
        color: white;
      }

      h1 { margin: 0; font-size: 24px; color: var(--text-primary); }
      p { margin: 0; color: var(--text-secondary); }
    }

    .details {
      padding: 30px 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      .label { color: var(--text-secondary); font-size: 14px; }
      .value { color: var(--text-primary); font-weight: 600; }
    }

    .actions {
      padding-top: 30px;
      text-align: center;
    }
  `]
})
export class ProfileComponent {
  constructor(public authService: AuthService) {}
}
