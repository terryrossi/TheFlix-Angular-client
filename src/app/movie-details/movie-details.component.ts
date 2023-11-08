import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent {
  public movie: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('movie-details.component Constructor: (movie) $$$$$$$$$$');
    console.log(data.movie);
    this.movie = data.movie;
  }
}
