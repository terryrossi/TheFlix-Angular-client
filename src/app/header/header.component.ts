import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
// this module allows tracking of the viewport's width to customize toolbar hamburger
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isSmallScreen: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    // Function that switch header view from buttons to hamburger
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  // Checking if user is logged to show login/register or Logoff Button
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
  openUserProfileDialog(): void {
    this.dialog.open(UserProfileComponent, {
      width: '100%',
    });
  }

  signOff(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.snackBar.open('You have been Logged Off!', 'OK', {
      duration: 2000,
      verticalPosition: 'top', // position the snackbar at the top
      horizontalPosition: 'center', // position the snackbar at the center horizontally
    });
    this.router.navigate(['/']); // Redirect to home/welcome page
  }
  showLoginPrompt(): void {
    this.snackBar.open('Please log in to view the movies', 'Close', {
      duration: 2000, // the message will be shown for 5 seconds; adjust as needed
      verticalPosition: 'top', // position the snackbar at the top
      horizontalPosition: 'center', // position the snackbar at the center horizontally
      panelClass: 'custom-snackbar',
    });
  }
}
