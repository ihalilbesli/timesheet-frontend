import { Component } from '@angular/core';
import { TimesheetService } from '../../../services/timesheet/timesheet.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../../services/export/export.service';

@Component({
  selector: 'app-timesheets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timesheets.component.html',
  styleUrl: './timesheets.component.css'
})
export class TimesheetsComponent {
  timesheets: any[] = [];
  userId: number | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private timesheetService: TimesheetService,
    private exportService: ExportService

  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.fetchTimesheetsForUser(this.userId);
      } else {
        this.fetchAllTimesheets();
      }
    });
  }

  fetchAllTimesheets() {
    this.isLoading = true;
    this.timesheetService.getAllTimesheets().subscribe({
      next: (data) => {
        this.timesheets = data.map(t => ({
          ...t,
          totalDuration: this.calculateDuration(t.startTime, t.endTime)
        }));
        this.isLoading = false;
      },
      error: () => {
        alert("Tüm timesheet verileri alınamadı.");
        this.isLoading = false;
      }
    });
  }

  fetchTimesheetsForUser(userId: number) {
    this.isLoading = true;
    this.timesheetService.getTimesheetsByUserId(userId).subscribe({
      next: (data) => {
        this.timesheets = data.map(t => ({
          ...t,
          totalDuration: this.calculateDuration(t.startTime, t.endTime)
        }));
        this.isLoading = false;
      },
      error: () => {
        alert("Timesheet verileri alınamadı.");
        this.isLoading = false;
      }
    });
  }

  calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();

    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let result = '';
    if (hours > 0) result += `${hours} saat `;
    if (minutes > 0) result += `${minutes} dakika`;

    return result.trim();
  }
  exportTimesheets(): void {
    if (!this.timesheets.length) {
      alert('Dışa aktarılacak timesheet kaydı bulunamadı.');
      return;
    }

    const exportData = this.timesheets.map(t => ({
      ID: t.id,
      Tarih: t.date,
      Başlangıç: t.startTime,
      Bitiş: t.endTime,
      Açıklama: t.description,
      Süre: t.totalDuration
    }));

    const filename = this.userId
      ? `kullanici_${this.userId}_timesheet.csv`
      : 'tum_timesheetler.csv';

    this.exportService.exportToCsv(filename, exportData);
  }

}
