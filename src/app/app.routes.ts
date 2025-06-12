import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';
import { roleGuard } from './guards/role/role.guard';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        loadComponent: () =>
            import('./components/welcome/welcome.component')
                .then(m => m.WelcomeComponent)
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./components/auth/login/login.component')
                .then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./components/auth/register/register.component')
                .then(m => m.RegisterComponent)
    },
    {
        path: 'profil',
        loadComponent: () =>
            import('./components/header/header.component').then(m => m.HeaderComponent),
        canActivate: [authGuard]
    },
    {
        path: 'user-dashboard',
        loadComponent: () =>
            import('./components/user/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard,roleGuard(['USER'])]
    }


];
