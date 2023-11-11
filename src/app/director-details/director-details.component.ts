import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-director-details',
  templateUrl: './director-details.component.html',
  styleUrls: ['./director-details.component.scss'],
})
export class DirectorDetailsComponent {
  public director: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.director = data.director;
    console.log(
      'director-details.component Constructor: (director) $$$$$$$$$$'
    );
    this.director.ImageUrl = '././assets/man.jpg';
    console.log(this.director);
  }
}
