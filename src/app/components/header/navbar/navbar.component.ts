import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

   currentUser: any;
  showMenu = false;
  currentTime: string = '';

  @ViewChild('dropdownMenuRef') dropdownMenuRef!: ElementRef;
  @ViewChild('toggleButtonRef') toggleButtonRef!: ElementRef;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userService.getCurrentUser().subscribe({
      next: (user) => this.currentUser = user,
      error: () => this.currentUser = null
    });
  }

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.showMenu) return;

    const clickedTarget = event.target as HTMLElement;
    const isInsideDropdown = this.dropdownMenuRef?.nativeElement.contains(clickedTarget);
    const isOnButton = this.toggleButtonRef?.nativeElement.contains(clickedTarget);

    if (!isInsideDropdown && !isOnButton) {
      this.showMenu = false;
    }
  }

  logout() {
    this.authService.logout();
  }

  goToProfile(tab: string = 'identity') {
    this.router.navigate(['/profil'], { queryParams: { tab } });
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleString('tr-TR', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
}
