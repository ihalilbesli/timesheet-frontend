import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TimesheetService } from '../../../services/timesheet/timesheet.service';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

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

  constructor(
    private timesheetService: TimesheetService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    if (!this.date || !this.startTime || !this.endTime) {
      this.toastr.warning('Tarih, başlangıç ve bitiş saatleri zorunludur.', 'Uyarı');
      return;
    }

    if (this.endTime <= this.startTime) {
      this.toastr.warning('Bitiş saati, başlangıç saatinden sonra olmalıdır.', 'Uyarı');
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
        this.router.navigate(['/timesheet/list']);
      },
      error: () => {
        this.toastr.error('Timesheet oluşturulamadı. Lütfen tekrar deneyin.', 'Hata');
      }
    });
  }
}
