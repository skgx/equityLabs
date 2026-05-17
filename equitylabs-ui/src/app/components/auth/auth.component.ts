import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isLogin = true;
  isLoading = false;
  hidePassword = true;
  authForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.authForm = this.fb.group({
      fullName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
       ? null : {'mismatch': true};
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.authForm.reset();
    
    // Update validators based on mode
    if (this.isLogin) {
      this.authForm.get('fullName')?.clearValidators();
      this.authForm.get('email')?.clearValidators();
      this.authForm.get('confirmPassword')?.clearValidators();
    } else {
      this.authForm.get('fullName')?.setValidators([Validators.required]);
      this.authForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.authForm.get('confirmPassword')?.setValidators([Validators.required]);
    }
    this.authForm.get('fullName')?.updateValueAndValidity();
    this.authForm.get('email')?.updateValueAndValidity();
    this.authForm.get('confirmPassword')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.isLogin || this.authForm.valid) {
      // Small hack: if login, we only need user/pass
      if (this.isLogin && (!this.authForm.get('username')?.value || !this.authForm.get('password')?.value)) {
        return;
      }

      this.isLoading = true;
      const values = this.authForm.value;

      const authObs = this.isLogin
        ? this.authService.login({ username: values.username, password: values.password })
        : this.authService.signup(values);

      authObs.subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open(this.isLogin ? 'Login Successful' : 'Account Created', 'Close', { 
            duration: 3000,
            panelClass: ['success-toast']
          });
          this.router.navigate(['/terminal']);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.snackBar.open(err.error?.message || 'Authentication failed', 'Close', { 
            duration: 5000,
            panelClass: ['error-toast']
          });
        }
      });
    }
  }
}
