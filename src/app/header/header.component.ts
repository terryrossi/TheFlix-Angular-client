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

/**
 * A component for displaying the application header.
 *
 * This component includes functionality for user login, registration, profile access,
 * and logout. It also handles responsive layout changes for small screen sizes.
 *
 * @Component Decorator to define the following:
 * - selector: 'app-header'
 * - templateUrl: './header.component.html'
 * - styleUrls: ['./header.component.scss']
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /**
   * Indicates if the viewport is a small screen size.
   */
  isSmallScreen: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    /**
     *  Function that switch header view from buttons to hamburger
     *
     * Observes the viewport size and updates `isSmallScreen` based on whether the XSmall breakpoint is matched.
     *
     * The `breakpointObserver.observe` method is used to monitor the viewport's width. It checks whether the current viewport
     * size matches the 'XSmall' breakpoint, typically corresponding to small screen devices like mobile phones.
     * If the viewport matches this breakpoint, indicating a small screen size, `isSmallScreen` is set to true.
     * Otherwise, it is set to false. This allows the HeaderComponent to adapt its layout and behavior for different screen sizes,
     * ensuring a responsive design.
     */
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  /**
   * Checks if the user is currently logged in.
   * @returns {boolean} True if the user is logged in, false otherwise.
   */
  isUserLoggedIn(): boolean {
    return (
      !!localStorage.getItem('token') && !!localStorage.getItem('userName')
    );
  }

  /**
   * Initializes the component.
   * Displays a login prompt if the user is not logged in.
   */
  ngOnInit(): void {
    if (!this.isUserLoggedIn()) {
      this.showLoginPrompt();
    }
  }

  /**
   * Opens the user registration dialog.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /**
   * Opens the user login dialog.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }

  /**
   * Opens the user profile dialog.
   */
  openUserProfileDialog(): void {
    this.dialog.open(UserProfileComponent, {
      width: '100%',
    });
  }

  /**
   * Signs off the user by removing login credentials from local storage and navigating to the home page.
   */
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

  /**
   * Displays a login prompt in a snackbar.
   */
  showLoginPrompt(): void {
    this.snackBar.open('Please log in to view the movies', 'Close', {
      duration: 2000, // the message will be shown for 5 seconds; adjust as needed
      verticalPosition: 'top', // position the snackbar at the top
      horizontalPosition: 'center', // position the snackbar at the center horizontally
      panelClass: 'custom-snackbar',
    });
  }
}
