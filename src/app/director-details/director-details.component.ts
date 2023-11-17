import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FetchApiDataService } from '../fetch-api-data.service';

/**
 * A component for displaying details about the movie director.
 *
 * This component presents information about a movie director. It is designed to be used within a dialog,
 * displaying details like the director's name, bio, birth year, and other relevant information.
 *
 * @Component Decorator to define the following:
 * - selector: 'app-director-details'
 * - templateUrl: './director-details.component.html'
 * - styleUrls: ['./director-details.component.scss']
 */
@Component({
  selector: 'app-director-details',
  templateUrl: './director-details.component.html',
  styleUrls: ['./director-details.component.scss'],
})
export class DirectorDetailsComponent {
  /**
   * Holds the director's data.
   */
  public director: any;

  /**
   * Constructs the component and initializes the director's data.
   * @param data {any} - Data injected into the component, typically containing the director's information.
   *
   * The constructor uses Angular's @Inject decorator to access data passed to this component, which is expected
   * to contain the director's details. This data is then assigned to the 'director' property. The ImageUrl for the
   * director is also set, pointing to a default image if an image URL is not provided in the data.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.director = data.director;
    console.log(
      'director-details.component Constructor: (director) $$$$$$$$$$'
    );
    this.director.ImageUrl = '././assets/man.jpg';
    console.log(this.director);
  }
}
