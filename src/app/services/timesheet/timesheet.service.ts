import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private apiUrl = 'http://localhost:8080/timesheet/timesheets/users';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  //  1. Yeni timesheet oluştur
  createTimesheet(timesheet:
    { date: string, startTime: string, endTime: string, description: string }):
    Observable<any> {
    const payload = {
      date: timesheet.date,
      startTime: timesheet.startTime,
      endTime: timesheet.endTime,
      description: timesheet.description
    };

    return this.http.post(this.apiUrl, payload, {
      headers: this.getHeaders()
    });
  }

  //  2. Kullanıcının tüm timesheet kayıtlarını getir
  getMyTimesheets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  //  3. Tarih aralığına göre filtrele
  getMyTimesheetsByDateRange(start: string, end: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/filter`, {
      headers: this.getHeaders(),
      params: {
        start,
        end
      }
    });
  }
  //  4. Mevcut bir timesheet’i güncelle
  updateTimesheet(id: number, updated: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updated, {
      headers: this.getHeaders()
    });
  }
  getTimesheetsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/user/${userId}`, {
      headers: this.getHeaders()
    });
  }
  getAllTimesheets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, {
      headers: this.getHeaders()
    });
  }
  // 5. Belirli bir tarihteki timesheet kayıtlarını getir
  getMyTimesheetsByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-date/${date}`, {
      headers: this.getHeaders()
    });
  }
  deleteTimesheet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }



}
