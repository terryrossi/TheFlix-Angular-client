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
    console.log('userDetails', userDetails);
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
    const token = localStorage.getItem('token');
    return this.http
      .post(`${apiUrl}users/${userName}/favorites`, movie, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Making the api call for: Delete a Favorite Movie from a User
  deleteFavoriteMovies(userName: string, movieId: string): Observable<any> {
    console.log('IN deleteFavoriteMovies. movieId = ', movieId);
    const token = localStorage.getItem('token');
    return this.http
      .delete(`${apiUrl}users/${userName}/favorites?movieId=${movieId}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
        // body: { movie: movie },
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for: Edit User
  public userEdit(userDetails: any): Observable<any> {
    console.log('userEdit userDetails', userDetails);
    const token = localStorage.getItem('token');
    if (!token) {
      // Handle the case where there is no token
      console.error('Token not found in localStorage');
      return throwError(() => new Error('Token not found'));
    }
    // Create an HTTPHeader with the JWT Token
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .patch(apiUrl + 'users', userDetails, httpOptions)
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
        responseType: 'text',
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // private extractResponseData(res: any): any {
  //   console.log('extractResponseData.................');
  //   console.log(res);
  //   // If response is a text, return it directly.
  //   if (typeof res === 'string') {
  //     return res;
  //   }
  //   // If response is JSON, return body or empty object.
  //   return res.body || {};
  // }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    // console.log('extractResponseData.................');
    // console.log(res);
    const body = res;
    console.log('extractResponseData in fetch-api-data. body = ', body);
    return body || {};
  }
  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Default error message
    let errorMessage = 'An unknown error occurred!';
    console.error('Error occurred:', error);

    // Client-side error
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    }
    // Backend returned an unsuccessful response code.
    else if (error.status !== 0) {
      // Backend returned a plain text message
      if (error.error instanceof ProgressEvent && error.statusText) {
        errorMessage = `Backend returned code ${error.status}: ${error.statusText}`;
      }
      // Backend returned a JSON error object
      else if (error.error.message) {
        errorMessage = error.error.message;
      }
      // Check if error contains an array of errors
      else if (
        Array.isArray(error.error.errors) &&
        error.error.errors.length > 0
      ) {
        errorMessage = error.error.errors[0].msg;
      }
      // General server-side error
      else {
        errorMessage = `Server returned code ${error.status}: ${error.message}`;
      }
    }
    // Other cases like network issues etc.
    else {
      errorMessage = 'Server could not be reached due to a network error';
    }

    // Log the error message
    console.error(errorMessage);

    // Throw an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }

  // private handleError(error: any): Observable<any> {
  //   let errorMessage = 'Unknown error!';
  //   // Temporarily handle error messages in each Component...
  //   console.log('Error in fetch-API : ' + error);
  //   console.log(error);
  //   // errorMessage = error.error.message;
  //   // errorMessage = error;

  //   // Check if the error is an instance of ErrorEvent
  //   if (error.error instanceof ErrorEvent) {
  //     // Handle client-side error
  //     errorMessage = error.error.message;
  //   } else if (error.error.message) {
  //     errorMessage = error.error.message;
  //   } else {
  //     // Check if error contains an array of errors
  //     if (
  //       error.error &&
  //       error.error.errors &&
  //       Array.isArray(error.error.errors) &&
  //       error.error.errors.length > 0
  //     ) {
  //       errorMessage = error.error.errors[0].msg;
  //     } else {
  //       // Handle server-side error
  //       errorMessage = `${error.status} - ${error.error}`;
  //     }
  //   }

  //   // window.alert(errorMessage);
  //   return throwError(() => new Error(errorMessage));
  // }

  // private handleErrorDeleteUser(error: any): Observable<any> {
  //   let errorMessage = 'Unknown error!';
  //   // Temporarily handle error messages in each Component...
  //   console.log('Error in Delete User : ' + error);
  //   console.log(error);
  //   // errorMessage = error.error.message;
  //   // errorMessage = error;

  //   // Check if the error is an instance of ErrorEvent
  //   if (error.error instanceof ErrorEvent) {
  //     // Handle client-side error
  //     errorMessage = error.error.message;
  //   } else if (error.error.message) {
  //     errorMessage = error.error.message;
  //   } else {
  //     // Check if error contains an array of errors
  //     if (
  //       error.error &&
  //       error.error.errors &&
  //       Array.isArray(error.error.errors) &&
  //       error.error.errors.length > 0
  //     ) {
  //       errorMessage = error.error.errors[0].msg;
  //     } else {
  //       // Handle server-side error
  //       errorMessage = `${error.status} - ${error.error}`;
  //     }
  //   }

  //   // window.alert(errorMessage);
  //   return throwError(() => new Error(errorMessage));
  // }
}
