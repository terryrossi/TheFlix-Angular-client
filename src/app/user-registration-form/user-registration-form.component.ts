// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result) => {
        // Log the successful response to the console
        console.log('Registration response:', result);

        // Logic for a successful user registration goes here!
        this.dialogRef.close(); // This will close the modal on success!
        this.snackBar.open('You have been Registered', 'OK', {
          duration: 20000,
        });
      },
      error: (errorResponse) => {
        // Log the detailed error response to the console
        console.log('Detailed error:', errorResponse);

        // Display the error message (assuming errorResponse.error contains the message)
        this.snackBar.open(errorResponse, 'OK', {
          duration: 20000,
        });
      },
    });
    //   (result) => {
    //     // Logic for a successful user registration goes here! (To be implemented)
    //     this.dialogRef.close(); // This will close the modal on success!
    //     console.log(result);
    //     this.snackBar.open(result, 'OK', {
    //       duration: 20000,
    //     });
    //   },
    //   (result) => {
    //     console.log(result);
    //     this.snackBar.open(result, 'OK', {
    //       duration: 20000,
    //     });
    //   }
    // );
  }
}
