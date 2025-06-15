import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // Şifre görünürlüğünü değiştirir
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Giriş butonuna tıklanınca çalışır
  onSubmit() {
    // Alanlar boşsa uyarı ver
    if (!this.username || !this.password) {
      this.toastr.warning('Kullanıcı adı ve şifre zorunludur.', 'Uyarı');
      return;
    }

    // Giriş işlemi
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        this.toastr.success('Giriş başarılı, yönlendiriliyorsunuz.', 'Başarılı');

        // Role göre yönlendirme
        if (role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'USER') {
          this.router.navigate(['/user-dashboard']);
        } else {
          this.router.navigate(['/welcome']);
        }
      },
      error: () => {
        this.toastr.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.', 'Hata');
      }
    });
  }
}
