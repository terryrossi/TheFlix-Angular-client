# TheFlixAngularClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# theFlix Movie App

## Objective

Using Angular and Angular-Material, build the client-side for an app called TheFlix-Angular based on its
existing server-side code (REST API and database).

## Context

Client-side development hasn’t always been so prominent. In the past, pages would be generated on
the server-side and sent to the browser, resulting in a poor user experience. Thanks to modern
browsers and libraries such as Angular, the client-side of an app is today considered to be just as
important as the server-side. Full-stack developers need to be well-versed in both server-side and
client-side development.
In the previous Achievement, I've built the server-side for a movie app called TheFlix with a React/Redux front-end in its first version. The API and database that I built meet the information needs of TheFlix-Angular users. Now, I am creating a second interface (the first one was React/Redux) they’ll use when making requests to—and receiving responses from—the server-side. The client-side of my TheFlix-Angular app will include several interface views (built using TypeScript, the Angular Framework and Material for html elements) that will handle data through the (previously defined) REST API endpoints.
The code i write impacts both the users and fellow developers. As I work through this
Achievement, I’ll need to consider, among other things, the readability and maintenance of my
codebase, and the design and usability of the app.
By the end of this Achievement, I’ll have a complete web app (client-side and server-side) built using
full-stack TypeScript technologies, which I can then showcase in my portfolio. This project will
demonstrate my mastery of full-stack JavaScript/TypeScript development. The complete tech stack I am
mastering is known as the MEAN (MongoDB, Express, Angular, and Node.js) stack.

## The 5 Ws

1. Who: The users of my TheFlix app. Movie enthusiasts who enjoy reading information about
   different movies.
2. What: A single-page, responsive app with routing, rich interactions, several interface views,
   and a polished user experience. The client-side developed in this Achievement supports
   the existing server-side (from Achievement 2) by facilitating user requests and rendering the
   response from the server-side via a number of different interface views.
3. When: TheFlix users will be able to use it whenever they want to read and save information
   about different movies.
4. Where: The app is hosted online. The TheFlix app itself is responsive and can therefore be
   used anywhere and on any device, giving all users the same experience.
5. Why: Movie enthusiasts like to be able to access information about different movies,
   whenever they want to. Having the ability to save a list of their favorite movies will ensure
   users always have access to the films they want to watch or recommend to their peers.

# Design Criteria

## User Stories

- As a user, I want to be able to access information about movies so that I can learn more
  about movies I’ve watched or am interested in.
- As a user, I want to be able to create a profile so I can save data about my favorite movies.

## Features & Requirements

**Essential Views & Features:**

### Main view

- Returns ALL movies to the user (each movie item with an image, title, and description)
- Ability to select a movie for more details
- Ability to log out
- Ability to navigate to Profile view

### Single Movie view

- Returns data (description, genre, director, image) about a single movie to the user
- Allows users to add a movie to their list of favorites

### Login view

- Allows users to log in with a username and password

### Signup view

- Allows new users to register (username, password, email, date of birth)

### Profile view

- Displays user registration details
- Allows users to update their info (firstname, lastname, email)
- Displays favorite movies
- Allows users to remove a movie from their list of favorites
- Allows existing users to deregister

**Optional Views & Features:**

### Genre view

- Returns data about a genre, with a name and description

### Director view

- Returns data about a director (name, bio, birth year, death year)

### Single Movie view (optional features)

- Allow users to view more information about a specific movies.

## Flow Chart of the different Components:

![TheFlix Angular App Flow Chart](diagrams/TheFlix-Angular-Flow.drawio.pdf)
