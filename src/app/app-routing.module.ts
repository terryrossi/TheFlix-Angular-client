import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MovieCardComponent } from './movie-card/movie-card.component';

const routes: Routes = [
  // { path: 'welcome', component: WelcomePageComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: '', redirectTo: 'movies', pathMatch: 'full' }, // changed from 'prefix' to 'full' to make it more precise
  { path: 'welcome', redirectTo: 'movies', pathMatch: 'full' }, // changed from 'prefix' to 'full' to make it more precise
];

/**
 * Routing module for the Angular application.
 *
 * This module defines the routes for the application and their corresponding components. It uses Angular's
 * RouterModule to configure these routes.
 *
 * Routes:
 * - 'movies': This route loads the `MovieCardComponent`, displaying the movie cards.
 * - '': A default route that redirects to 'movies', ensuring that users are directed to the movie list
 *   when they access the root URL.
 * - 'welcome': Previously a route for the `WelcomePageComponent`, now redirects to 'movies'. This change
 *   reflects a shift in the application structure, prioritizing direct access to the movies list.
 *
 * The `RouterModule.forRoot(routes)` method is used to register these routes at the application's root level.
 * The AppRoutingModule exports `RouterModule` so it can be used throughout the application.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
