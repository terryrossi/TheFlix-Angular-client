import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
// import { catchError } from 'rxjs/internal/operators';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://theflix-api.herokuapp.com/';

/**
 * Service to handle API calls for 'TheFlix' application.
 * This service includes methods to handle user registration, login, fetching movies,
 * fetching directors and genres, managing favorite movies, and user profile editing.
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  private favoriteMoviesIDs = new BehaviorSubject<string[]>([]);

  /**
   * Observable for components to subscribe to favorite movies IDs.
   */
  public favoriteMoviesIDs$ = this.favoriteMoviesIDs.asObservable();

  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param userDetails - The details of the user to register.
   * @returns An Observable containing the registered user data.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Logs in a user.
   * @param userDetails - The login details of the user.
   * @returns An Observable containing the login response.
   */
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

  /**
   * Fetches all movies.
   * @returns An Observable containing an array of movies.
   */
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

  /**
   * Fetches a single movie by its ID.
   * @param movieId - The ID of the movie to fetch.
   * @returns An Observable containing the movie Object.
   */
  getOneMovies(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/id/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetches a director by ID.
   * @param directorId - The ID of the director to fetch.
   * @returns An Observable containing the director's Object.
   */
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

  /**
   * Fetches a genre by ID.
   * @param genreId - The ID of the genre to fetch.
   * @returns An Observable containing the genre's Object.
   */
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

  /**
   * Retrieves data for a specific user.
   * @param userName - The username of the user to retrieve data for.
   * @returns An Observable containing the user's Object.
   *
   * This method makes an HTTP GET request to the backend API, fetching details of the specified user.
   * It requires a valid JWT token, stored in local storage, to be sent as an Authorization header for
   * authenticating the request. The response is then processed to extract meaningful data.
   * In case of an error, the handleError method is called to process and throw an appropriate error.
   */
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

  /**
   * Retrieves the list of favorite movies for a specific user.
   * @param userName - The username of the user whose favorite movies are to be retrieved.
   * @returns An Observable containing the list of the user's favorite movies.
   *
   * This method makes an HTTP GET request to the backend API to fetch the favorite movies of the specified user.
   * It requires a valid JWT token, stored in local storage, for authenticating the request. The response data
   * is then processed to extract the user's favorite movies. If an error occurs during the request, the
   * handleError method is invoked to process and throw an appropriate error.
   * Response will be in extractResponseData.favoriteMovies
   */
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

  /**
   * Adds a movie to the user's list of favorite movies.
   * @param userName - The username of the user to whom the movie is to be added.
   * @param movie - The movie object or data to be added to the user's favorite movies list.
   * @returns An Observable containing the updated list of the user's favorite movies.
   *
   * This method makes an HTTP POST request to the backend API to add a specified movie to the favorite list of a user.
   * The movie data is included in the request body. A valid JWT token is required for authenticating the request, which is
   * sent as an Authorization header. If an error occurs during the request, the handleError method is invoked to process
   * and throw an appropriate error. The response from the server is expected to contain the updated list of favorite movies.
   */
  addFavoriteMovies(userName: string, movie: any): Observable<any> {
    console.log('IN addFavoriteMovies. movie object = ', movie);

    const token = localStorage.getItem('token');
    return this.http
      .post(`${apiUrl}users/${userName}/favorites`, movie, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a movie from a user's list of favorite movies.
   * @param userName {string} - The username of the user from whose favorites the movie will be removed.
   * @param movieId {string} - The ID of the movie to be removed from the user's favorite movies list.
   * @returns {Observable<any>} An Observable containing the response from the server, usually the updated list of favorite movies.
   *
   * This method sends an HTTP DELETE request to remove a specific movie from the list of favorite movies of a specified user.
   * It requires a valid JWT token for authentication, which is sent in the Authorization header. The movie ID is sent as a query parameter.
   * If an error occurs during the request, it is caught and processed by the handleError method.
   */
  deleteFavoriteMovies(userName: string, movieId: string): Observable<any> {
    console.log('IN deleteFavoriteMovies. movieId = ', movieId);
    const token = localStorage.getItem('token');
    return (
      this.http
        .delete(`${apiUrl}users/${userName}/favorites?movieId=${movieId}`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
          // body: { movie: movie },
        })
        // .pipe(map(this.extractResponseData), catchError(this.handleError));
        .pipe(catchError(this.handleError))
    );
  }
  /**
   * Updates the BehaviorSubject for favorite movies.
   * @param newFavorites {string[]} - The new list of favorite movies' IDs.
   *
   * This method updates the BehaviorSubject, favoriteMoviesIDs, with a new list of favorite movies.
   * It is typically called after adding or removing a movie from a user's favorites to ensure the
   * list is current and reflects the latest changes.
   */ updateFavoriteMovies(newFavorites: string[]) {
    this.favoriteMoviesIDs.next(newFavorites);
  }

  /**
   * Edits and updates user details.
   * @param userDetails {any} - The updated details of the user to be submitted.
   * @returns {Observable<any>} An Observable containing the response from the server, the updated user Object.
   *
   * This method sends an HTTP PATCH request to update the details of a user. It requires a valid JWT token for authentication,
   * which is sent in the Authorization header along with the updated user details in the request body.
   * If the token is not found in localStorage, an error is thrown immediately. The response from the server
   * includes the updated user Object. Any errors during the request are caught and processed by the handleError method.
   */
  public userEdit(userDetails: any): Observable<any> {
    // console.log('userEdit userDetails', userDetails);
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

  /**
   * Deletes a user account.
   * @param userName {string} - The username of the user account to be deleted.
   * @returns {Observable<any>} An Observable containing the response from the server, usually a confirmation message.
   *
   * This method sends an HTTP DELETE request to the backend API to delete a user account specified by the username.
   * It requires a valid JWT token for authentication, which is sent in the Authorization header. The response type is set to 'text'
   * as the expected response is a plain text confirmation message. If an error occurs during the request, it is caught
   * and processed by the handleError method.
   */
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

  /**
   * Extracts and processes the response data from HTTP responses.
   * @param res {any} - The HTTP response object received from the API call.
   * @returns {any} The extracted data from the response object. If the response body is empty, an empty object is returned.
   *
   * This is a private utility method used internally within the service to handle the extraction of data from HTTP responses.
   * It takes the response object as a parameter, extracts the relevant data (if any), and returns it. If the response body is
   * empty or undefined, it returns an empty object. This method is used in conjunction with RxJS operators in API calls to process
   * the received Non-typed responses.
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Handles and processes errors resulting from HTTP requests.
   * @param error {HttpErrorResponse} - The error response object received from an HTTP request.
   * @returns {Observable<never>} An Observable that emits a user-friendly error message.
   *
   * This method is responsible for processing errors encountered during HTTP requests. Its behavior varies based on the type of error:
   * 1. Client-Side Errors: Extracts and logs the error message from the ErrorEvent object.
   * 2. Server-Side Errors: Processes the HTTP status code and response message. It handles different types of responses:
   *    a. Plain Text Message: Extracts and logs the server's status text.
   *    b. JSON Error Object: Extracts and logs the specific error message from the JSON response.
   *    c. Array of Errors: Extracts the first error message from an array of errors in the JSON response.
   *    d. General Error: Logs a generic server-side error message based on the status code and message.
   * 3. Network or Other Errors: Catches cases where the server could not be reached (e.g., network issues) and logs a corresponding message.
   *
   * The method then logs a detailed error message to the console. If the error status is not 0 (indicating a network issue), it
   * constructs and throws an Observable error with a user-friendly error message for the subscriber to catch and handle appropriately.
   */
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
}
