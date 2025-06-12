import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router: Router) { }

  goToUserList() {
    this.router.navigate(['/users-list']); 
  }

  goToTimesheetList() {
    this.router.navigate(['/timesheets']);
  }

}
