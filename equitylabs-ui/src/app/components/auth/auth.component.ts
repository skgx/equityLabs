import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('login', style({
        transform: 'translateX(0%)'
      })),
      state('signup', style({
        transform: 'translateX(-50%)'
      })),
      transition('login <=> signup', [
        animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms 100ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = signal(false); // Default to Signup as requested
  
  signupData = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  loginData = {
    email: '',
    password: ''
  };

  toggleMode() {
    this.isLoginMode.set(!this.isLoginMode());
  }

  onSignup() {
    if (this.signupData.password !== this.signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    this.authService.signup(this.signupData).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => console.error('Signup failed', err)
    });
  }

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => console.error('Login failed', err)
    });
  }
}
