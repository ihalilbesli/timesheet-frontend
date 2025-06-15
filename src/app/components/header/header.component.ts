import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user: any = null;
  formUser: any = {};
  error: string = '';

  editMode = false;
  changePasswordMode = false;

  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'identity';
      this.editMode = (tab === 'identity');
      this.changePasswordMode = (tab === 'password');
    });

    this.getUser();
  }

  getUser() {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.formUser = { ...data };
      },
      error: () => {
        this.error = 'Kullanıcı bilgileri alınamadı.';
        this.toastr.error('Kullanıcı bilgileri alınamadı.', 'Hata');
      }
    });
  }

  updateProfile() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formUser.email)) {
      this.toastr.warning('Lütfen geçerli bir email adresi giriniz.', 'Uyarı');
      return;
    }

    const updatedData = {
      username: this.formUser.username,
      email: this.formUser.email
    };

    this.userService.updateCurrentUser(updatedData).subscribe({
      next: () => {
        this.toastr.success('Bilgileriniz başarıyla güncellendi.', 'Başarılı');
        this.getUser();
      },
      error: (err) => {
        if (err.error?.message?.includes('kullanıcı adı')) {
          this.toastr.error('Bu kullanıcı adı zaten kullanılıyor.', 'Uyarı');
        } else if (err.error?.message?.includes('e-posta')) {
          this.toastr.error('Bu e-posta adresi zaten kullanılıyor.', 'Uyarı');
        } else {
          this.toastr.error('Güncelleme sırasında hata oluştu.', 'Hata');
        }
      }
    });
  }

  updatePassword() {
    const pwd = this.passwordData.newPassword;

    // Regex: minimum 8 karakter, 1 büyük harf, 1 küçük harf, 1 özel karakter
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastr.warning('Yeni şifreler eşleşmiyor.', 'Uyarı');
      return;
    }

    if (!complexityRegex.test(pwd)) {
      this.toastr.warning(
        'Şifre en az 8 karakter, bir büyük harf, bir küçük harf ve bir özel karakter içermelidir.',
        'Uyarı'
      );
      return;
    }

    this.userService.updatePassword(
      this.passwordData.oldPassword,
      this.passwordData.newPassword
    ).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Şifre başarıyla güncellendi.', 'Başarılı');
        this.passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
        this.router.navigate(['/user-dashboard']);
      },
      error: (err) => {
        const message = err.error?.message?.toLowerCase() || '';
        if (message.includes('eski şifre')) {
          this.toastr.error('Eski şifreniz hatalı.', 'Hata');
        } else {
          this.toastr.error('Şifre güncellenemedi.', 'Hata');
        }
      }
    });
  }


  cancelEdit() {
    this.editMode = false;
    this.changePasswordMode = false;
    this.formUser = { ...this.user };
    this.passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
  }

  get passwordMismatch(): boolean {
    return this.passwordData.newPassword !== this.passwordData.confirmPassword;
  }
}
