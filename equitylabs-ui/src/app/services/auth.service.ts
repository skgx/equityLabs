import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  userId: string;
  email: string;
  username: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  
  // Using signals for modern reactive state management
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.setSession(res))
    );
  }

  signup(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUserSignal.set(null);
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem('auth_token', authResult.token);
    localStorage.setItem('user_data', JSON.stringify(authResult.user));
    this.currentUserSignal.set(authResult.user);
  }

  private loadUserFromStorage(): User | null {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
