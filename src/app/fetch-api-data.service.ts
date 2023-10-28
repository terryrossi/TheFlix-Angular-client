import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
// import { catchError } from 'rxjs/internal/operators';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://theflix-api.herokuapp.com/';
// const userName = 'totototo';
// const password = 'totototo';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  // Making the api call for: User registration
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Making the api call for: User Login
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(
        apiUrl +
          'login?userName=' +
          userDetails.userName +
          '&password=' +
          userDetails.password,
        {}
      )
      .pipe(catchError(this.handleError));
  }

  // Making the api call for: Get all movies
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for: Get one movie
  getOneMovies(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for: Get Director
  getDirector(directorId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'directors/' + directorId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for: Get Genre
  getGenre(genreId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'genres/' + genreId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for: Get User
  getUser(userName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + userName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for: Get Favorite Movies for a User
  // It will be in extractResponseData.favoriteMovies
  getFavoriteMovies(userName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + userName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for: Add a Favorite Movie to a User
  // It will be in extractResponseData.favoriteMovies
  addFavoriteMovies(userName: string, movie: any): Observable<any> {
    // const token = localStorage.getItem('token');
    return this.http
      .post(apiUrl + 'users/' + userName, { movie })
      .pipe(catchError(this.handleError));
  }

  // Making the api call for: Delete a Favorite Movie from a User
  deleteFavoriteMovies(userName: string, movie: any): Observable<any> {
    const token = localStorage.getItem('token');
    // return this.http
    // .delete(apiUrl + 'users/' + userName , {movie})
    // .pipe(catchError(this.handleError));
    return this.http
      .delete(`${apiUrl}users/${userName}/favorites?id=${movie}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for: Edit User
  public userEdit(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .patch(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Making the api call for: Delete User
  deleteUser(userName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(`${apiUrl}users/${userName}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // Error Handling
  // private handleError(error: HttpErrorResponse): any {
  //   if (error.error instanceof ErrorEvent) {
  //     console.error('Some error occurred:', error.error.message);
  //   } else {
  //     console.error(
  //       `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
  //     );
  //   }
  //   return throwError('Something bad happened; please try again later.');
  // }
  // private handleError(error: any): Observable<any> {
  //   let errorMessage = 'Unknown error!';
  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = `Error: ${error.errors[0].msg}`;
  //   } else {
  //     errorMessage = `Error Code: ${error.status} ${error.error}`;
  // console.log('error.error.errors[0].msg : ');
  // console.log(error.error.errors[0].msg);
  //   }
  //   window.alert(errorMessage);
  //   // return throwError(errorMessage);
  //   return throwError(() => new Error(errorMessage));
  // }
  private handleError(error: any): Observable<any> {
    let errorMessage = 'Unknown error!';

    // Check if the error is an instance of ErrorEvent
    if (error.error instanceof ErrorEvent) {
      // Handle client-side error
      errorMessage = error.error.message;
    } else {
      // Check if error contains an array of errors
      if (
        error.error &&
        error.error.errors &&
        Array.isArray(error.error.errors) &&
        error.error.errors.length > 0
      ) {
        errorMessage = error.error.errors[0].msg;
      } else {
        // Handle server-side error
        errorMessage = `${error.status} - ${error.error}`;
      }
    }

    window.alert(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
