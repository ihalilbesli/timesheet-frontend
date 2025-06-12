import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user: any = null;

  constructor(private userService: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: () => {
        this.toastr.error('Kullanıcı bilgileri alınamadı.', 'Hata');
      }
    });
  }
}
