import { Component } from '@angular/core';
import { TimesheetService } from '../../../services/timesheet/timesheet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportService } from '../../../services/export/export.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timesheet-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timesheet-list.component.html',
  styleUrl: './timesheet-list.component.css'
})
export class TimesheetListComponent {
  timesheets: any[] = [];
  filteredTimesheets: any[] = [];

  startDate: string = '';
  endDate: string = '';
  isLoading = false;

  // Güncelleme için
  editId: number | null = null;
  date: string = '';
  startTime: string = '';
  endTime: string = '';
  description: string = '';

  constructor(
    private timesheetService: TimesheetService,
    private exportService: ExportService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchAll();
  }

  fetchAll(): void {
    this.isLoading = true;
    this.timesheetService.getMyTimesheets().subscribe({
      next: (data) => {
        this.timesheets = data.map(t => ({
          ...t,
          totalDuration: this.calculateDuration(t.startTime, t.endTime)
        }));
        this.filteredTimesheets = this.timesheets;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error("Timesheet verileri alınamadı.", "Hata");
        this.isLoading = false;
      }
    });
  }

  filterByDate(): void {
    if (this.startDate && this.endDate) {
      this.timesheetService.getMyTimesheetsByDateRange(this.startDate, this.endDate).subscribe({
        next: (data) => {
          this.filteredTimesheets = data.map(t => ({
            ...t,
            totalDuration: this.calculateDuration(t.startTime, t.endTime)
          }));
        },
        error: () => {
          this.toastr.error("Filtreleme işlemi başarısız oldu.", "Hata");
        }
      });
    }
  }

  clearFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.filteredTimesheets = this.timesheets;
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
          this.fetchAll();
        },
        error: () => {
          this.toastr.error('Güncelleme başarısız.', 'Hata');
        }
      });
    }
  }

  downloadCsv(): void {
    if (this.filteredTimesheets.length === 0) {
      this.toastr.info("İndirilecek veri yok.", "Bilgi");
      return;
    }

    const exportData = this.filteredTimesheets.map(t => ({
      Tarih: t.date,
      Açıklama: t.description,
      'Başlangıç Saati': t.startTime,
      'Bitiş Saati': t.endTime,
      'Toplam Süre': t.totalDuration
    }));

    this.exportService.exportToCsv('timesheets.csv', exportData);
    this.toastr.success('CSV dosyası oluşturuldu.', 'Başarılı');
  }
}
