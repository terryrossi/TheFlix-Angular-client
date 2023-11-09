// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

// Router
import { Router } from '@angular/router';

import { NgForm } from '@angular/forms';

// Additional Form fields
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
  // standalone: true,
  // imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = {
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    email: '',
    birthDate: '',
  };

  hidePassword = true;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  // Make password visible or invisible
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // This is the function responsible for sending the form inputs to the backend
  registerUser(registrationForm: NgForm): void {
    if (!registrationForm.valid) {
      // Optionally handle the invalid form case, e.g., show a message
      return;
    }
    if (this.userData.birthDate) {
      const dateObject = new Date(this.userData.birthDate);
      this.userData.birthDate = dateObject.toISOString().split('T')[0];
    }

    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result) => {
        // Log the successful response to the console
        console.log('Registration response:', result);

        // Logic for a successful user registration goes here!
        this.dialogRef.close(); // This will close the modal on success!
        // localStorage.setItem('token', result.token); // assuming the response contains the token in a field named 'token'
        // localStorage.setItem('userName', this.userData.userName);
        this.snackBar.open(
          'You have been Registered. Next please Log In...',
          'OK',
          {
            duration: 20000,
          }
        );
        this.router.navigate(['movies']);
      },
      error: (errorResponse) => {
        // Log the detailed error response to the console
        console.log('Detailed error:', errorResponse);

        // Display the error message (assuming errorResponse.error contains the message)
        this.snackBar.open(errorResponse, 'OK', {
          // duration: 20000,
          verticalPosition: 'top', // position the snackbar at the top
          horizontalPosition: 'center', // position the snackbar at the center horizontally
          panelClass: 'custom-snackbar',
        });
      },
    });
  }
}
