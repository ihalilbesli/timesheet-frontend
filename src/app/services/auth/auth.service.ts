import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/timesheet/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Giriş
  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        const token = response.token;
        if (token) {
          localStorage.setItem('jwtToken', token);
          console.log('✅ Token kaydedildi:', token);
        } else {
          console.warn('❗ Token alınamadı!');
        }
      })
    );
  }

  // Kayıt
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      console.log('🔍 Decoded payload:', decoded);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Token decode hatası:', error);
      return null;
    }
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.sub || null;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.role || null;
  }
}
