import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/timesheet/users';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Mevcut kullanıcının bilgilerini al
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, {
      headers: this.getHeaders()
    });
  }

  // Mevcut kullanıcının bilgilerini güncelle
  updateCurrentUser(data: { username: string; email: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, data, {
      headers: this.getHeaders()
    });
  }

  // Şifre güncelleme isteği gönder
  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    const payload = { oldPassword, newPassword };
    return this.http.put(`${this.apiUrl}/me/password`, payload, {
      headers: this.getHeaders()
    });
  }

  // Admin tarafından kullanıcı listesi istenecekse
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/timesheet/admin/users`, {
      headers: this.getHeaders()
    });
  }
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`, {
      headers: this.getHeaders()
    });
  }
}
