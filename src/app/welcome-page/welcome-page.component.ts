import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  isUserLoggedIn(): boolean {
    return (
      !!localStorage.getItem('token') && !!localStorage.getItem('userName')
    );
  }

  ngOnInit(): void {
    if (!this.isUserLoggedIn()) {
      this.showLoginPrompt();
    }
  }

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
  signOff(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.snackBar.open('You have been Logged Off!', 'OK', {
      duration: 20000,
    });
    this.router.navigate(['/']); // Redirect to home/welcome page
  }
  showLoginPrompt(): void {
    this.snackBar.open('Please log in to view the movies', 'Close', {
      // duration: 200000, // the message will be shown for 5 seconds; adjust as needed
      verticalPosition: 'top', // position the snackbar at the top
      horizontalPosition: 'center', // position the snackbar at the center horizontally
      panelClass: 'custom-snackbar',
    });
  }
}
