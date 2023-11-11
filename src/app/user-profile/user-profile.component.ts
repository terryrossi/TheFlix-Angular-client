import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

// App Components
import { FetchApiDataService } from '../fetch-api-data.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
  originalUserData: any = {}; // A copy of the initial user data for comparison

  hidePassword = true;

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public dialog: MatDialog,
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
          // Make a deep copy of the initial userData for later comparison
          this.originalUserData = JSON.parse(JSON.stringify(response));

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

    // Check if userData has changed
    if (
      JSON.stringify(this.originalUserData) === JSON.stringify(this.userData)
    ) {
      // No changes detected, so no need to update
      this.snackBar.open('No changes made.', 'OK', {
        duration: 2000,
      });
      return;
    }

    // If changes are detected, proceed with the update
    this.fetchApiData.userEdit(this.userData).subscribe({
      next: (result) => {
        // Log the successful response to the console
        console.log('User Update response:', result);

        // Logic for a successful user update goes here!
        this.dialogRef.close(); // This will close the modal on success!

        // localStorage.setItem('userName', this.userData.userName);
        this.snackBar.open('User has been Updated', 'OK', {
          duration: 2000,
          verticalPosition: 'top', // position the snackbar at the top
          horizontalPosition: 'center', // position the snackbar at the center horizontally
        });
        this.router.navigate(['movies']);
      },
      error: (errorResponse) => {
        // Log the detailed error response to the console
        console.log('Detailed error:', errorResponse);

        // Display the error message (assuming errorResponse.error contains the message)
        this.snackBar.open(errorResponse, 'OK', {
          duration: 2000,
          verticalPosition: 'top', // position the snackbar at the top
          horizontalPosition: 'center', // position the snackbar at the center horizontally
          panelClass: 'custom-snackbar',
        });
      },
    });
  }

  deleteUserProfile(): void {
    // If changes are detected, proceed with the update
    this.fetchApiData.deleteUser(this.userData.userName).subscribe({
      next: (result) => {
        // Logic for a successful user delete goes here!
        this.dialogRef.close(); // This will close the modal on success!
        localStorage.removeItem('token');
        localStorage.removeItem('userName');

        this.router.navigate(['/']); // Redirect to home/welcome page

        this.snackBar.open('User has been Deleted', 'OK', {
          duration: 2000,
          verticalPosition: 'top', // position the snackbar at the top
          horizontalPosition: 'center', // position the snackbar at the center horizontally
        });
      },
      error: (errorResponse) => {
        // Log the detailed error response to the console
        console.log('Detailed errorResponse in delete user:', errorResponse);

        // Display the error message (assuming errorResponse.error contains the message)
        this.snackBar.open(errorResponse, 'OK', {
          duration: 2000,
          verticalPosition: 'top', // position the snackbar at the top
          horizontalPosition: 'center', // position the snackbar at the center horizontally
          panelClass: 'custom-snackbar',
        });
      },
    });
  }

  // Window confirmation for deleting User
  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUserProfile();
      }
    });
  }
}
