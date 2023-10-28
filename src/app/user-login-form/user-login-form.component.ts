// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
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

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (result) => {
        // Log the successful response to the console
        console.log('Login response:', result);

        // Logic for a successful user login goes here!

        this.router.navigate(['movies']);

        this.dialogRef.close(); // This will close the modal on success!
        localStorage.setItem('token', result.token); // assuming the response contains the token in a field named 'token'
        localStorage.setItem('username', this.userData.userName);
        this.snackBar.open('You have been Logged In!', 'OK', {
          duration: 20000,
        });
      },
      error: (errorResponse) => {
        // Log the detailed error response to the console
        console.log('Detailed error:', errorResponse.error);

        // Display the error message (assuming errorResponse.error contains the message)
        this.snackBar.open(errorResponse.error, 'OK', {
          duration: 20000,
        });
      },
    });
  }
}