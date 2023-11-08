import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { NgForm } from '@angular/forms';

// Router
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  // Assuming userData is the object that contains the user's information
  userData: any = {};

  hidePassword = true;

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    // Retrieve the user data from local storage or an API
    const userName = localStorage.getItem('userName');
    // Check if userName is not null
    if (userName) {
      // Use the fetchApiDataService to call the getUser method
      this.fetchApiData.getUser(userName).subscribe(
        (response) => {
          this.userData = response;
          console.log('USERDATA : ***********');
          console.log(this.userData);
          return this.userData;
        },
        (error) => {
          // Handle errors here
          console.error('Error fetching user data:', error);
        }
      );
    } else {
      console.error('No userName found in localStorage');
    }
  }

  updateUserProfile(profileForm: NgForm): void {
    if (!profileForm.valid) {
      // Optionally handle the invalid form case, e.g., show a message
      return;
    }

    this.fetchApiData.userEdit(this.userData).subscribe({
      next: (result) => {
        // Log the successful response to the console
        console.log('User Update response:', result);

        // Logic for a successful user update goes here!
        this.dialogRef.close(); // This will close the modal on success!

        // localStorage.setItem('userName', this.userData.userName);
        this.snackBar.open('User has been Updated', 'OK', {
          duration: 20000,
        });
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
