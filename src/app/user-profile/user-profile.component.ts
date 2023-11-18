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

/**
 * A component for displaying and managing the user's profile.
 *
 * This component allows users to view and edit their profile information, manage their favorite movies,
 * and interact with movie details, genres, and directors. It also provides the functionality to delete the user's profile.
 *
 * @Component Decorator to define the following:
 * - selector: 'app-user-profile'
 * - templateUrl: './user-profile.component.html'
 * - styleUrls: ['./user-profile.component.scss']
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  /**
   * The current user's data.
   */
  userData: any = {};

  /**
   * A copy of the initial user data for comparison purposes.
   */
  originalUserData: any = {}; // A copy of the initial user data for comparison

  /**
   * An array of favorite movie IDs for the current user.
   */
  favoriteMoviesIDs: string[] = [];

  /**
   * A list of movie objects based on the user's favorite movie IDs.
   */
  movies: any[] = [];

  /**
   * A boolean to control the visibility of the password field.
   */
  hidePassword = true;

  /**
   * A subscription to manage RxJS subscriptions.
   * This could be used to subscribe to an observable that would allow refreshing of the
   * list of favoriteMoviesIDs when the user make a change in the user profile
   * like removing a favorited movie from his list.
   */
  // private subscriptions = new Subscription();

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }

  /**
   * Retrieves the current user's data from local storage or the API.
   */
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

          // Gets the list of favorite movies for this user
          // Check if user has favorite movie IDs and fetch the corresponding movie objects
          // if (this.favoriteMoviesIDs && this.favoriteMoviesIDs.length > 0) {
          // }
          // this.subscriptions.add(
          //   this.fetchApiData.favoriteMoviesIDs$.subscribe((ids) => {
          //     this.favoriteMoviesIDs = ids;

          //     this.getFavoriteMoviesObjects();
          //   })
          // );

          // Go grab the list of favorite movies (Object._id's) from this user and transform them into strings
          // because the API call used later to fetch a single movie expect a string as a parameter
          this.favoriteMoviesIDs = this.userData.favoriteMovies.map((id: any) =>
            id.toString()
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

  /**
   * Fetches movie objects based on the user's favorite movie IDs.
   */
  getFavoriteMoviesObjects(): void {
    this.movies = []; // Reset movies array

    this.favoriteMoviesIDs.forEach((movieId) => {
      this.fetchApiData.getOneMovies(movieId).subscribe((movieObject) => {
        // this.movies.push(movieObject);
        this.movies = [...this.movies, movieObject];
        // If we need to trigger change detection, we should use the next line (Never work!)
        // this.changeDetectorRef.detectChanges();
      });
    });
  }

  /**
   * Checks if a movie ID is in the user's list of favorites.
   * @param movieId {any} - The ID of the movie to check.
   * @returns {boolean} - True if the movie is a favorite, otherwise false.
   */
  isFavorite(movieId: any): boolean {
    return this.favoriteMoviesIDs.includes(movieId.toString());
  }

  /**
   * Toggles the favorite status of a movie.
   * @param movie {any} - The movie object to toggle.
   */
  toggleFavorite(movie: any): void {
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

  /**
   * Updates the user's profile with the provided form data.
   * @param profileForm {NgForm} - The form containing the user's profile data.
   *
   * This method is responsible for handling the submission of the user profile update form.
   * It first checks if the form is valid. If not, it can handle this case, by showing a message.
   *
   * Then, it checks if the `userData` has changed compared to `originalUserData`. If there are no changes,
   * it simply displays a message indicating that no changes were made and exits the method and the html
   * won't active the "Update User" Button.
   *
   * If there are changes, html activates the "Update User" button and this method
   * proceeds to submit the updated `userData` to the backend API via the `fetchApiData.userEdit` service.
   *
   * Upon a successful response from the API, it closes the dialog, displays a confirmation message.
   * In case of an error response, it logs the detailed error and displays an error message to the user.
   */
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

  /**
   * Deletes the current user's profile.
   *
   * This method calls the `deleteUser` method from the `fetchApiData` service to delete the current user's profile.
   * It uses the `userName` from `userData` to identify the user to be deleted.
   *
   * Upon a successful response from the API, it performs several actions:
   *  - Closes the modal dialog to indicate the completion of the process.
   *  - Removes the user's token and userName from local storage, effectively logging them out.
   *  - Navigates to the home/welcome page.
   *  - Displays a confirmation message that the user has been deleted.
   *
   * In the case of an error response from the API, it logs the detailed error and displays an error message to the user.
   * This could be useful for debugging and providing feedback to the user.
   */
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

  /**
   * Opens a confirmation dialog for deleting the user's profile.
   *
   * This method triggers the display of a confirmation dialog when a user attempts to delete their profile.
   * It utilizes Angular Material's dialog model to open `ConfirmDialogComponent`.
   *
   * Once the dialog is closed, it subscribes to the `afterClosed` event of the dialog reference.
   * If the result from the dialog is affirmative (i.e., the user confirms the action),
   * it proceeds to call the `deleteUserProfile` method to actually delete the user's profile.
   *
   * This method ensures that user actions are intentional and prevents accidental deletions.
   */
  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUserProfile();
      }
    });
  }

  /**
   * Opens a dialog to display details about a specific genre.
   * @param genre {any} - The genre object containing details to be displayed.
   *
   * This method is responsible for opening a dialog box that shows detailed information about a specific movie genre.
   * It uses Angular Material's Dialog service to create and open the `GenreDetailsComponent` as a modal dialog.
   *
   * The genre data, which typically includes details like the genre's name and description,
   * is passed to the `GenreDetailsComponent` via the `data` property. This allows the dialog component to
   * access and display the specific details of the genre.
   *
   * The width of the dialog is set to 500px, providing a consistent size for the presentation of genre details.
   */
  openGenreDetails(genre: any): void {
    this.dialog.open(GenreDetailsComponent, {
      width: '500px',
      data: { genre: genre }, // Pass the genre data to the dialog
    });
  }

  /**
   * Opens a dialog to display details about a specific director.
   * @param director {any} - The director object containing details to be displayed.
   *
   * This method is designed to open a dialog box that presents detailed information about a movie director.
   * It utilizes Angular Material's Dialog service to instantiate and open the `DirectorDetailsComponent` as a modal dialog.
   *
   * The method receives a director object, which includes information such as the director's name, bio, and possibly other relevant details.
   * This data is passed to the `DirectorDetailsComponent` through the `data` property, enabling the dialog component to
   * access and exhibit the director's specific details.
   *
   * The dialog's width is consistently set to 500px, ensuring a uniform display size for director details.
   * This function enhances the user experience by providing more context about the directors of the movies.
   */
  openDirectorDetails(director: any): void {
    this.dialog.open(DirectorDetailsComponent, {
      width: '500px',
      data: { director: director }, // Pass the director data (in movie) to the dialog
    });
  }

  /**
   * Opens a dialog to display details about a specific movie.
   * @param movie {any} - The movie object containing details to be displayed.
   *
   * This method opens a dialog box to show detailed information about a selected movie.
   * The `MovieDetailsComponent` is used as the content of the dialog, and it is opened using Angular Material's Dialog service.
   *
   * The received movie object, which typically includes information like the movie's title, description, genre, director, and more,
   * is passed to the `MovieDetailsComponent`. This is done via the `data` property, allowing the dialog component to
   * access and display the specific details of the movie.
   *
   * The dialog's size is dynamically set with a height of 'auto' and a maximum height of '90vh', ensuring it adjusts to the content size
   * while maintaining a viewable area within the viewport. This dynamic sizing provides an optimal viewing experience across different devices.
   */
  openMovieDetails(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      // width: '80vw',
      // maxWidth: '100vw',
      height: 'auto',
      maxHeight: '90vh',
      data: { movie: movie }, // Pass the movie data to the dialog
    });
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   *
   * This method is part of Angular's component lifecycle hooks and is invoked just before Angular destroys the component.
   * It is used for any custom cleanup that might be needed when the component instance is destroyed. This is especially
   * important for preventing memory leaks and ensuring that any subscriptions or event listeners added by the component
   * are properly disposed of.
   *
   * Inside this method:
   * - A console log is used for debugging to indicate that the component is being destroyed.
   * - The `movies` array is cleared, ensuring that any references to movie objects are removed, which helps in garbage collection.
   * - All active subscriptions are unsubscribed using `this.subscriptions.unsubscribe()`. This is crucial to prevent memory leaks
   *   caused by lingering subscriptions that are no longer needed once the component is no longer in use.
   *
   * Note: If additional event listeners or other cleanup tasks are added in the future, they should also be addressed in this method.
   */ ngOnDestroy() {
    this.movies = [];
    // this.subscriptions.unsubscribe();
  }
}
