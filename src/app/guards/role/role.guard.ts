import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service'; 

export function roleGuard(expectedRole: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getUserRole(); 

    if (userRole && expectedRole.includes(userRole)) {
      return true;
    }

    router.navigate(['/welcome']);
    return false;
  };
}
