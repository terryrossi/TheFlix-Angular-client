import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * A component for displaying details about a specific movie.
 *
 * This component is used to present detailed information about a movie, such as its title, plot, director, genre, and more.
 * It is typically utilized within a dialog to provide a more detailed view of the movie's attributes.
 *
 * @Component Decorator to define the following:
 * - selector: 'app-movie-details'
 * - templateUrl: './movie-details.component.html'
 * - styleUrls: ['./movie-details.component.scss']
 */
@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent {
  /**
   * Holds the movie's data.
   */
  public movie: any;

  /**
   * Constructs the component and initializes the movie's data.
   * @param data {any} - Data injected into the component, typically containing the movie's information.
   *
   * The constructor uses Angular's @Inject decorator to access the data passed to this component, which generally includes
   * the movie's details such as title, plot, and associated metadata. The injected data is then assigned to the 'movie'
   * property. This property is subsequently used to populate the relevant sections of the dialog with the movie's details.
   */

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('movie-details.component Constructor: (movie) $$$$$$$$$$');
    console.log(data.movie);
    this.movie = data.movie;
  }
}
