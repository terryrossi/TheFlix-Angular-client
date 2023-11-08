import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.scss'],
})
export class GenreDetailsComponent {
  public genre: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.genre = data.genre;
    console.log('genre-details.component Constructor: (genre) $$$$$$$$$$');
    console.log(this.genre);
  }
}
