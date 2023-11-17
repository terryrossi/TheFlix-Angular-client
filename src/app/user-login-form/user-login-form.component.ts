// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

import { NgForm } from '@angular/forms';

/**
 * A component for user login.
 *
 * This component provides a form for users to enter their login credentials (username and password).
 * It communicates with the backend API to authenticate the user, handling both successful logins and
 * login errors. On successful login, it stores the user's token and username in local storage.
 *
 * @Component Decorator to define the following:
 * - selector: 'app-user-login-form'
 * - templateUrl: './user-login-form.component.html'
 * - styleUrls: ['./user-login-form.component.scss']
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  /**
   * User data for the login form, with fields for username and password.
   */
  @Input() userData = {
    userName: '',
    password: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Handles the user login process. Submits the login form data to the backend API.
   * @param loginForm {NgForm} - The login form with user data.
   *
   * This function checks if the login form is valid, and then uses the `FetchApiDataService` to send
   * the login data to the backend. On successful login, it closes the dialog, stores the user's token
   * and username in local storage, and optionally navigates to another route. If there's an error,
   * it displays an error message in a snackbar.
   */
  loginUser(loginForm: NgForm): void {
    if (!loginForm.valid) {
      // Optionally handle the invalid form case, e.g., show a message
      return;
    }
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (result) => {
        console.log('Login response:', result); // Log the successful response to the console

        /**
         * Successful user login
         *  */

        this.dialogRef.close(); // This will close the modal on success!
        localStorage.setItem('token', result.token);
        localStorage.setItem('userName', this.userData.userName);
        this.snackBar.open('You have been Logged In!', 'OK', {
          duration: 2000,
          verticalPosition: 'top', // position the snackbar at the top
          horizontalPosition: 'center', // position the snackbar at the center horizontally
        });
      },
      error: (errorResponse) => {
        // Log the detailed error response to the console
        console.log('Detailed error BELOW:', errorResponse);
        console.log(errorResponse);
        this.snackBar.open(errorResponse, 'OK', {
          duration: 2000,
        });
        // }
      },
    });
  }
}
