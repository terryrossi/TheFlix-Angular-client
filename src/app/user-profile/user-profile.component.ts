import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

// App Components
import { FetchApiDataService } from '../fetch-api-data.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import { GenreDetailsComponent } from '../genre-details/genre-details.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { DirectorDetailsComponent } from '../director-details/director-details.component';

// Router
import { Router } from '@angular/router';

// forkjoin allows to wait for async function to be executed
// Subscription will collect all subscription
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  // userData is the object that contains the user's information
  userData: any = {};
  originalUserData: any = {}; // A copy of the initial user data for comparison

  // gather the list of favorite movie id's of this user in order to fetch the movie objects and list them in the user profile
  favoriteMoviesIDs: string[] = [];

  private subscriptions = new Subscription();

  // gather list of movie objects based on favoriteMoviesIDs array above
  movies: any[] = [];

  hidePassword = true;

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('@@@@ ngOnInit');
    // fetch user object
    this.getUserData();
  }

  getUserData(): void {
    console.log('@@@@ getUserData');

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

          // Gets the list of favorite movies for this user
          // Check if user has favorite movie IDs and fetch the corresponding movie objects
          // if (this.favoriteMoviesIDs && this.favoriteMoviesIDs.length > 0) {
          // }
          this.subscriptions.add(
            this.fetchApiData.favoriteMoviesIDs$.subscribe((ids) => {
              this.favoriteMoviesIDs = ids;

              this.getFavoriteMoviesObjects();
            })
          );

          // Go grab the list of favorite movies (Object._id's) from this user and transform them into strings
          // because the API call used later to fetch a single movie expect a string as a parameter
          this.favoriteMoviesIDs = this.userData.favoriteMovies.map((id: any) =>
            id.toString()
          );

          console.log(
            'favoriteMoviesIDs in user-profile getUserData() : ',
            this.favoriteMoviesIDs
          );
          // Check if user has favorite movie IDs and fetch the corresponding movie objects
          if (this.favoriteMoviesIDs && this.favoriteMoviesIDs.length > 0) {
            this.getFavoriteMoviesObjects();
          }
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

  // Go fetch the list of movie objects that have been favorited by the user
  getFavoriteMoviesObjects(): void {
    console.log('@@@@ getFavoriteMoviesObjects');

    this.movies = []; // Reset movies array
    console.log(
      'IN getFavoriteMoviesObjects ######################################## movies just reset to [] = ',
      this.movies
    );
    console.log('this.favoriteMoviesIDs ; ', this.favoriteMoviesIDs);
    this.favoriteMoviesIDs.forEach((movieId) => {
      console.log('movieId : ', movieId);
      this.fetchApiData.getOneMovies(movieId).subscribe((movieObject) => {
        // this.movies.push(movieObject);
        this.movies = [...this.movies, movieObject];
        // If we need to trigger change detection, we should use the next line
        // this.changeDetectorRef.detectChanges();
        console.log(
          'list of favorited movie Objects in PROFILE inside method getFavoriteMoviesObjects() : ',
          this.movies
        );
      });
    });
  }

  // Check if a movie is in the list of the user's favorites
  isFavorite(movieId: any): boolean {
    console.log('@@@@ isFavorite');

    return this.favoriteMoviesIDs.includes(movieId.toString());
  }

  // Add or remove the Red Fovorite Icon based on the user's input
  toggleFavorite(movie: any): void {
    console.log('@@@@ toggleFavorite');

    const userName = localStorage.getItem('userName') || '';

    if (this.isFavorite(movie._id)) {
      this.fetchApiData
        .deleteFavoriteMovies(userName, movie._id)
        .subscribe(() => {
          this.favoriteMoviesIDs = this.favoriteMoviesIDs.filter(
            (id) => id !== movie._id
          );
          // Update the BehaviorSubject in the service
          this.fetchApiData.updateFavoriteMovies(this.favoriteMoviesIDs);
          // trigger change detection if necessary
          // this.changeDetectorRef.detectChanges();
        });
    } else {
      this.fetchApiData.addFavoriteMovies(userName, movie).subscribe(() => {
        this.favoriteMoviesIDs = [...this.favoriteMoviesIDs, movie._id];
        // Update the BehaviorSubject in the service
        this.fetchApiData.updateFavoriteMovies(this.favoriteMoviesIDs);
        // trigger change detection if necessary
        // this.changeDetectorRef.detectChanges();
      });
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

  // Methods to open dialogs for Genre, Director, and Movie Details
  openGenreDetails(genre: any): void {
    this.dialog.open(GenreDetailsComponent, {
      width: '500px',
      data: { genre: genre }, // Pass the genre data to the dialog
    });
  }

  openDirectorDetails(director: any): void {
    // console.log(director);
    this.dialog.open(DirectorDetailsComponent, {
      width: '500px',
      data: { director: director }, // Pass the director data (in movie) to the dialog
    });
  }

  openMovieDetails(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      // width: '80vw',
      // maxWidth: '100vw',
      height: 'auto',
      maxHeight: '90vh',
      data: { movie: movie }, // Pass the movie data to the dialog
    });
  }

  // Cleanup if needed, especially if you add any other event listeners
  ngOnDestroy() {
    console.log('@@@@ ngOnDestroy');
    this.movies = [];
    this.subscriptions.unsubscribe();
  }
}
