import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TimesheetService } from '../../../services/timesheet/timesheet.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timesheet-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timesheet-create.component.html',
  styleUrl: './timesheet-create.component.css'
})
export class TimesheetCreateComponent {
  date: string = '';
  startTime: string = '';
  endTime: string = '';
  description: string = '';
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private timesheetService: TimesheetService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    const today = new Date().toISOString().split('T')[0];
    if (!this.date || !this.startTime || !this.endTime) {
      this.toastr.warning('Tarih, başlangıç ve bitiş saatleri zorunludur.', 'Uyarı');
      return;
    }

    if (this.date > today) {
      this.toastr.warning('Gelecekteki bir tarih seçilemez.', 'Uyarı');
      return;
    }

    if (this.endTime <= this.startTime) {
      this.toastr.warning('Bitiş saati, başlangıç saatinden sonra olmalıdır.', 'Uyarı');
      return;
    }

    // Zaman çakışmasını kontrol et
    this.timesheetService.getMyTimesheetsByDate(this.date).subscribe({
      next: (entries) => {
        const conflict = entries.some((entry: any) =>
          this.isOverlapping(entry.startTime, entry.endTime, this.startTime, this.endTime)
        );

        if (conflict) {
          this.toastr.warning('Bu saat aralığında zaten bir kayıt var.', 'Çakışma');
          return;
        }

        const timesheet = {
          date: this.date,
          startTime: this.startTime,
          endTime: this.endTime,
          description: this.description
        };

        this.timesheetService.createTimesheet(timesheet).subscribe({
          next: () => {
            this.toastr.success('Timesheet başarıyla oluşturuldu!', 'Başarılı');
            this.router.navigate(['/user-dashboard']);
          },
          error: () => {
            this.toastr.error('Timesheet oluşturulamadı. Lütfen tekrar deneyin.', 'Hata');
          }
        });
      },
      error: () => {
        this.toastr.error('Mevcut kayıtlar kontrol edilemedi.', 'Hata');
      }
    });
  }

  // Saat çakışması kontrolü
  isOverlapping(start1: string, end1: string, start2: string, end2: string): boolean {
    return !(end2 <= start1 || start2 >= end1);
  }
}
