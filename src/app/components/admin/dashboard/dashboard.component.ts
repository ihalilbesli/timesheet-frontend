import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,UserListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router: Router) {}

  goToTimesheetList() {
    this.router.navigate(['/timesheets']); 
  }

}
