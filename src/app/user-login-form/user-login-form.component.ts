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
  loginUser(loginForm: NgForm): void {
    if (!loginForm.valid) {
      // Optionally handle the invalid form case, e.g., show a message
      return;
    }
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (result) => {
        // Log the successful response to the console
        console.log('Login response:', result);

        // Logic for a successful user login goes here!

        this.dialogRef.close(); // This will close the modal on success!
        localStorage.setItem('token', result.token); // assuming the response contains the token in a field named 'token'
        localStorage.setItem('userName', this.userData.userName);
        this.snackBar.open('You have been Logged In!', 'OK', {
          duration: 20000,
        });

        // this.router.navigate(['movies']);
      },
      error: (errorResponse) => {
        // Log the detailed error response to the console
        console.log('Detailed error BELOW:', errorResponse);
        console.log(errorResponse);
        // console.log(
        // 'errorResponse.error.message:',
        // errorResponse.error.message
        // );
        // console.log(errorResponse.error.message);

        // Display the error message (assuming errorResponse.error.message contains the message)
        // if (errorResponse.error.message) {
        this.snackBar.open(errorResponse, 'OK', {
          // duration: 20000,
        });
        // }
      },
    });
  }
}
