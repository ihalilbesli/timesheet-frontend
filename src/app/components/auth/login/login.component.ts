import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Kullanıcı adı ve şifre zorunludur.';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        const role = this.authService.getUserRole();
        console.log('👤 User role:', role);

        if (role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'USER') {
          this.router.navigate(['/user-dashboard']);
        } else {
          this.router.navigate(['/welcome']); // bilinmeyen roller için fallback
        }
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.errorMessage = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
      }
    });
  }
}
