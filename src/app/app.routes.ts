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
        canActivate: [authGuard, roleGuard(['USER'])]
    },
    {
        path: 'user-timesheet-create',
        loadComponent: () =>
            import('./components/user/timesheet-create/timesheet-create.component')
                .then(m => m.TimesheetCreateComponent),
        canActivate: [authGuard, roleGuard(['USER'])]
    },
    {
        path: 'user-timesheet-list',
        loadComponent: () =>
            import('./components/user/timesheet-list/timesheet-list.component')
                .then(m => m.TimesheetListComponent),
        canActivate: [authGuard, roleGuard(['USER'])]
    },
    {
        path: 'admin-dashboard',
        loadComponent: () =>
            import('./components/admin/dashboard/dashboard.component')
                .then(m => m.DashboardComponent),
        canActivate: [authGuard, roleGuard(['ADMIN'])]
    },
    {
        path: 'users-list',
        loadComponent: () =>
            import('./components/admin/user-list/user-list.component')
                .then(m => m.UserListComponent),
        canActivate: [authGuard, roleGuard(['ADMIN'])]
    },
    {
        path: 'timesheets',
        loadComponent: () =>
            import('./components/admin/timesheets/timesheets.component')
                .then(m => m.TimesheetsComponent),
        canActivate: [authGuard, roleGuard(['ADMIN'])]
    }



];
