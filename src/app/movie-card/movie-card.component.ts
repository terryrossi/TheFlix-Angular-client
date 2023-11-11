// src/app/movie-card/movie-card.component.ts
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

// Application Components
import { FetchApiDataService } from '../fetch-api-data.service';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { GenreDetailsComponent } from '../genre-details/genre-details.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { DirectorDetailsComponent } from '../director-details/director-details.component';

// Angular Material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

// Router
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit, OnDestroy {
  movies: any[] = [];
  // userName: string = '';
  userFavorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  isUserLoggedIn(): boolean {
    return (
      !!localStorage.getItem('token') && !!localStorage.getItem('userName')
    );
  }

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
    console.log('is logged in? ' + this.isUserLoggedIn());
    if (!this.isUserLoggedIn()) {
      this.showLoginPrompt();
    }
    // Gets the list of movies
    this.getMovies();
    // this.getUserFavorites();
    this.handleScroll(); // Initial positioning
    console.log('User logged In: ' + this.isUserLoggedIn());
  }

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
  signOff(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.snackBar.open('You have been Logged Off!', 'OK', {
      duration: 20000,
    });
    this.router.navigate(['/']); // Redirect to home/welcome page
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

  // Go fetch the favorite movies of the current user
  getUserFavorites(): void {
    const userName = localStorage.getItem('userName');
    if (userName) {
      console.log('running getUserFavorites...');
      this.fetchApiData.getUser(userName).subscribe((user: any) => {
        // console.log('user.favoriteMovies : ', user.favoriteMovies);
        // this.userFavorites = user.favoriteMovies.map((fav: any) =>
        //   fav.$oid ? fav.$oid.toString() : null
        // );
        this.userFavorites = user.favoriteMovies;

        this.userFavorites = this.userFavorites.filter((id) => id !== null); // Filter out null entries
        // assuming fav is an object with an _id property

        // To force change detection of userFavorites...
        // this.changeDetectorRef.detectChanges();

        console.log('userFavorites = ', this.userFavorites);
      });
    }
  }
  // Check if a movie is in the list of the user's favorites
  isFavorite(movieId: any): boolean {
    // console.log(' isFavorite ????????????????????????????????');
    // console.log('typeof movieId param: ', typeof movieId);
    // console.log('movieId : ', movieId);
    // console.log('userFavorites : ', this.userFavorites);
    // console.log('type of userFavorites[0]', typeof this.userFavorites[0]);
    // console.log('Typeof : this.movies[0]._id: ', typeof this.movies[0]._id);
    // console.log('Movies._id: ', this.movies[0]._id);

    return this.userFavorites.includes(movieId.toString());
  }

  // Add or remove the Red Fovorite Icon based on the user's input
  toggleFavorite(movie: any): void {
    const userName = localStorage.getItem('userName') || '';

    if (this.isFavorite(movie._id)) {
      console.log('prepare to delete movie from fav. UserName and movie._id');
      console.log(userName);
      console.log(movie._id);
      this.fetchApiData
        .deleteFavoriteMovies(userName, movie._id)
        .subscribe(() => {
          this.userFavorites = this.userFavorites.filter(
            (id) => id !== movie._id
          );
          // Update UI accordingly...
        });
    } else {
      console.log('prepare to ADD movie to userFavorites');
      console.log(' UserName and movie : ', userName, movie);

      this.fetchApiData.addFavoriteMovies(userName, movie).subscribe(() => {
        this.userFavorites.push(movie._id);
        // Update UI accordingly...
      });
    }
  }

  addToFavorites(movieId: string): void {
    // if (!this.isUserLoggedIn()) {
    //   this.showLoginPrompt();
    //   return;
    // }
    // this.fetchApiData
    //   .addMovieToFavorites(movieId)
    //   .subscribe((response: any) => {
    //     this.snackBar.open('Added to Favorites!', 'OK', { duration: 2000 });
    //     // Update local state or UI if needed
    //   });
  }

  ngOnDestroy() {
    // Cleanup if needed, especially if you add any other event listeners
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('Movies: ', this.movies);
      // Call getUserFavorites here to ensure it's called after movies data is loaded
      this.getUserFavorites();
      // return this.movies;
    });
  }

  showLoginPrompt(): void {
    this.snackBar.open('Please log in to view the list of Movies', 'Close', {
      duration: 100000, // the message will be shown for 5 seconds; adjust as needed
      verticalPosition: 'top', // position the snackbar at the top
      horizontalPosition: 'center', // position the snackbar at the center horizontally
      panelClass: 'custom-snackbar',
    });
  }
}
