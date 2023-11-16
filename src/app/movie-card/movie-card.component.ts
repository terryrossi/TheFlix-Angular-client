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

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit, OnDestroy {
  // list of all movies
  movies: any[] = [];

  favoriteMoviesIDs: string[] = [];

  private subscriptions = new Subscription();

  constructor(
    public fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog, // private router: Router
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  // Adjustable width
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const stickyWrapper = document.querySelector(
      '.sticky-wrapper'
    ) as HTMLElement;
    if (stickyWrapper) {
      stickyWrapper.style.left = -window.scrollX + 'px';
    }
  }

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

  // Check if user is Logged In
  isUserLoggedIn(): boolean {
    return (
      // double negative operator returns true or false instead of values
      !!localStorage.getItem('token') && !!localStorage.getItem('userName')
    );
  }

  // Go fetch the whole list of movie object
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  // Go fetch the favorite movie id's of the current user
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
  // Check if a movie is in the list of the user's favorites
  isFavorite(movieId: any): boolean {
    return this.favoriteMoviesIDs.includes(movieId.toString());
  }

  // Add or remove the Red Fovorite Icon based on the user's input
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
        this.changeDetectorRef.detectChanges();
      });
    }
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

  showLoginPrompt(): void {
    this.snackBar.open('Please log in to view the list of Movies', 'Close', {
      duration: 10000, // the message will be shown for 5 seconds; adjust as needed
      verticalPosition: 'top', // position the snackbar at the top
      horizontalPosition: 'center', // position the snackbar at the center horizontally
      panelClass: 'custom-snackbar',
    });
  }

  // Cleanup if needed, especially if you add any other event listeners
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
