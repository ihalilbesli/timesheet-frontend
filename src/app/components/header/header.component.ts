import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  user: any = null;
  error: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: () => {
        this.error = 'Kullanıcı bilgileri alınamadı.';
        this.toastr.error('Kullanıcı bilgileri alınamadı.', 'Hata');
      }
    });
  }
}
