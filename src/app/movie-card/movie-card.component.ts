// src/app/movie-card/movie-card.component.ts
import {
  Component,
  HostListener,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

// Application Components
import { FetchApiDataService } from '../fetch-api-data.service';

import { GenreDetailsComponent } from '../genre-details/genre-details.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { DirectorDetailsComponent } from '../director-details/director-details.component';

// Angular Material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

// Subscription will collect all subscription
import { Subscription } from 'rxjs';

// Router
// import { Router } from '@angular/router';

/**
 * A component for displaying movie cards.
 *
 * This component is responsible for displaying a list of movies, managing and displaying user's favorite movies,
 * and handling interactions such as adding or removing movies from favorites. It also includes dialog functionalities
 * for genre, director, and movie details.
 *
 * @Component Decorator to define the following:
 * - selector: 'app-movie-card'
 * - templateUrl: './movie-card.component.html'
 * - styleUrls: ['./movie-card.component.scss']
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit, OnDestroy {
  /**
   * List of all movies.
   */
  movies: any[] = [];
  /**
   * List of favorite movie IDs for the user.
   */
  favoriteMoviesIDs: string[] = [];
  /**
   * Subscription to manage RxJS subscriptions.
   */
  private subscriptions = new Subscription();

  constructor(
    public fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog, // private router: Router
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * HostListener to handle window scroll events for adjustable width.
   */
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const stickyWrapper = document.querySelector(
      '.sticky-wrapper'
    ) as HTMLElement;
    if (stickyWrapper) {
      stickyWrapper.style.left = -window.scrollX + 'px';
    }
  }

  /**
   * Initializes the component by fetching the list of all movies and favorite movies for the user.
   * Displays a login prompt if the user is not logged in.
   */
  ngOnInit(): void {
    // console.log('is logged in? ' + this.isUserLoggedIn());
    // Not sure this is Needed. CHECK AND POTRNTIALLY REMOVE
    if (!this.isUserLoggedIn()) {
      this.showLoginPrompt();
    }

    // Get all movies
    this.getMovies();

    // Gets the list of favorite movies for this user
    this.getUserFavorites();
    this.subscriptions.add(
      this.fetchApiData.favoriteMoviesIDs$.subscribe((ids) => {
        this.favoriteMoviesIDs = ids;
      })
    );

    this.handleScroll(); // Initial positioning

    console.log('User logged In: ' + this.isUserLoggedIn());
  }

  /**
   * Checks if the user is currently logged in.
   * @returns {boolean} True if the user is logged in, false otherwise.
   */
  isUserLoggedIn(): boolean {
    return (
      // double negative operator returns true or false instead of values
      !!localStorage.getItem('token') && !!localStorage.getItem('userName')
    );
  }

  /**
   * Fetches the complete list of movies from the API.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  /**
   * Fetches the current user's favorite movie IDs.
   */
  getUserFavorites(): void {
    const userName = localStorage.getItem('userName');
    if (userName) {
      this.fetchApiData.getUser(userName).subscribe((user: any) => {
        this.favoriteMoviesIDs = user.favoriteMovies;
        // Filter out null entries and fill up subscription
        this.favoriteMoviesIDs = this.favoriteMoviesIDs.filter(
          (id) => id !== null
        );
      });
    }
  }
  /**
   * Checks if a movie is in the list of the user's favorites.
   * @param movieId {any} - The ID of the movie to check.
   * @returns {boolean} True if the movie is a favorite, false otherwise.
   */
  isFavorite(movieId: any): boolean {
    return this.favoriteMoviesIDs.includes(movieId.toString());
  }

  /**
   * Toggles a movie's favorite status. Adds or removes the movie from the user's favorites.
   * @param movie {any} - The movie to be added or removed from favorites.
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
          this.changeDetectorRef.detectChanges();
        });
    } else {
      this.fetchApiData.addFavoriteMovies(userName, movie).subscribe(() => {
        // this.userFavorites.push(movie._id);
        this.favoriteMoviesIDs = [...this.favoriteMoviesIDs, movie._id];
        // Update the BehaviorSubject in the service
        this.fetchApiData.updateFavoriteMovies(this.favoriteMoviesIDs);
        // trigger change detection if necessary
        // this.changeDetectorRef.detectChanges();
      });
    }
  }

  /**
   * Opens the dialog for displaying genre details.
   * @param genre {any} - The genre data to display.
   */
  openGenreDetails(genre: any): void {
    this.dialog.open(GenreDetailsComponent, {
      width: '500px',
      data: { genre: genre }, // Pass the genre data to the dialog
    });
  }

  /**
   * Opens the dialog for displaying director details.
   * @param director {any} - The director data to display.
   */
  openDirectorDetails(director: any): void {
    // console.log(director);
    this.dialog.open(DirectorDetailsComponent, {
      width: '500px',
      data: { director: director }, // Pass the director data (in movie) to the dialog
    });
  }

  /**
   * Opens the dialog for displaying movie details.
   * @param movie {any} - The movie data to display.
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
   * Displays a login prompt in a snackbar.
   */
  showLoginPrompt(): void {
    this.snackBar.open('Please log in to view the list of Movies', 'Close', {
      duration: 10000, // the message will be shown for 5 seconds; adjust as needed
      verticalPosition: 'top', // position the snackbar at the top
      horizontalPosition: 'center', // position the snackbar at the center horizontally
      panelClass: 'custom-snackbar',
    });
  }

  /**
   * Cleans up the component, unsubscribing from any subscriptions to prevent memory leaks.
   */
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
