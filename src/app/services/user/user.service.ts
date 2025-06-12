import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/timesheet/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Mevcut kullanıcının bilgilerini al (JWT ile kimlik doğrulanmış)
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, {
      headers: this.getHeaders()
    });
  }

  // Admin tarafından kullanıcı listesi istenecekse
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/timesheet/admin/users`, {
      headers: this.getHeaders()
    });
  }
}
