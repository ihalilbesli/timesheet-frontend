import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimesheetService } from '../../../services/timesheet/timesheet.service';
import { ExportService } from '../../../services/export/export.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timesheets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timesheets.component.html',
  styleUrl: './timesheets.component.css'
})
export class TimesheetsComponent {
  timesheets: any[] = [];
  userId: number | null = null;
  isLoading = false;

  // Güncelleme için
  editId: number | null = null;
  date: string = '';
  startTime: string = '';
  endTime: string = '';
  description: string = '';

  constructor(
    private route: ActivatedRoute,
    private timesheetService: TimesheetService,
    private exportService: ExportService,
    private toastr: ToastrService
  ) {}

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

  fetchAllTimesheets(): void {
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
        this.toastr.error("Tüm timesheet verileri alınamadı.", "Hata");
        this.isLoading = false;
      }
    });
  }

  fetchTimesheetsForUser(userId: number): void {
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
        this.toastr.error("Timesheet verileri alınamadı.", "Hata");
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

  editTimesheet(t: any): void {
    this.editId = t.id;
    this.date = t.date;
    this.startTime = t.startTime;
    this.endTime = t.endTime;
    this.description = t.description;
  }

  resetForm(): void {
    this.editId = null;
    this.date = '';
    this.startTime = '';
    this.endTime = '';
    this.description = '';
  }

  onSubmit(): void {
    if (!this.date || !this.startTime || !this.endTime) {
      this.toastr.warning('Tüm alanlar zorunludur.', 'Uyarı');
      return;
    }

    if (this.endTime <= this.startTime) {
      this.toastr.warning('Bitiş saati, başlangıç saatinden sonra olmalıdır.', 'Uyarı');
      return;
    }

    const body = {
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      description: this.description
    };

    if (this.editId !== null) {
      this.timesheetService.updateTimesheet(this.editId, body).subscribe({
        next: () => {
          this.toastr.success('Güncelleme başarılı!', 'Başarılı');
          this.resetForm();
          this.fetchAllTimesheets();
        },
        error: () => {
          this.toastr.error('Güncelleme başarısız.', 'Hata');
        }
      });
    }
  }

  deleteTimesheet(id: number): void {
    if (confirm("Bu timesheet kaydını silmek istediğinize emin misiniz?")) {
      this.timesheetService.deleteTimesheet(id).subscribe({
        next: () => {
          this.toastr.success('Timesheet silindi.', 'Başarılı');
          this.fetchAllTimesheets();
        },
        error: () => {
          this.toastr.error('Silme işlemi başarısız oldu.', 'Hata');
        }
      });
    }
  }

exportTimesheets(): void {
  if (!this.timesheets.length) {
    this.toastr.info("Dışa aktarılacak timesheet kaydı bulunamadı.", "Bilgi");
    return;
  }

  const exportData = this.timesheets.map(t => ({
    KullanıcıAdı: t.user?.username || '',
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
  this.toastr.success('CSV dosyası oluşturuldu.', 'Başarılı');
}
}
