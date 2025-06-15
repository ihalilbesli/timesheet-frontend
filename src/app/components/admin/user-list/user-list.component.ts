import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../../services/export/export.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading = false;

  searchUsername: string = '';
  searchEmail: string = '';
  searchDate: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private exportService: ExportService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error("Kullanıcılar alınamadı.", "Hata");
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const usernameMatch = this.searchUsername === '' || user.username?.toLowerCase().includes(this.searchUsername.toLowerCase());
      const emailMatch = this.searchEmail === '' || user.email?.toLowerCase().includes(this.searchEmail.toLowerCase());
      const dateMatch = this.searchDate === '' || (user.createdAt && user.createdAt.startsWith(this.searchDate));
      return usernameMatch && emailMatch && dateMatch;
    });
  }

  clearFilters(): void {
    this.searchUsername = '';
    this.searchEmail = '';
    this.searchDate = '';
    this.filteredUsers = [...this.users];
  }

  viewTimesheets(userId: number): void {
    this.router.navigate(['/timesheets'], { queryParams: { userId } });
  }

  exportUsers(): void {
    const exportData = this.filteredUsers.map(user => ({
      ID: user.id,
      KullanıcıAdı: user.username,
      Email: user.email,
      Rol: user.role,
      KayıtTarihi: user.createdAt
    }));
    this.exportService.exportToCsv('kullanicilar.csv', exportData);
  }

  deleteUser(userId: number): void {
    if (confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.toastr.success('Kullanıcı başarıyla silindi.', 'Başarılı');
          this.ngOnInit(); // Listeyi yenile
        },
        error: () => {
          this.toastr.error('Kullanıcı silinirken hata oluştu.', 'Hata');
        }
      });
    }
  }
}
