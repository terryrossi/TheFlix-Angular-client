import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FetchApiDataService } from '../fetch-api-data.service';

/**
 * A component for displaying details about a movie genre.
 *
 * This component is used to present information about a specific movie genre, such as its name and description.
 * It is typically utilized within a dialog to provide additional context or information about the genre of a movie.
 *
 * @Component Decorator to define the following:
 * - selector: 'app-genre-details'
 * - templateUrl: './genre-details.component.html'
 * - styleUrls: ['./genre-details.component.scss']
 */
@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.scss'],
})
export class GenreDetailsComponent {
  /**
   * Holds the genre's data.
   */
  public genre: any;

  /**
   * Constructs the component and initializes the genre's data.
   * @param data {any} - Data injected into the component, containing the genre's information.
   *
   * The constructor utilizes Angular's @Inject decorator to access the data passed to this component, which includes
   * the genre's details. The injected data is then assigned to the 'genre' property. This information contains
   * the genre's name and description, and it is displayed in the dialog that this component forms a part of.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.genre = data.genre;
    console.log('genre-details.component Constructor: (genre) $$$$$$$$$$');
    console.log(this.genre);
  }
}
