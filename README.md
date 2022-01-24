# Around the U.S.
*Around the U.S.* is a social media site where users can make an account, edit their profiles, and interact with photos. 
<br><br>
[around-the-us.students.nomoreparties.site](https://around-the-us.students.nomoreparties.site)<br />
[www.around-the-us.students.nomoreparties.site](https://www.around-the-us.students.nomoreparties.site)

---

## Application Features

* create an account and sign in
* edit profile section: avatar, name, about me
* add cards by submitting a valid link and name
* delete cards (users can only delete cards they created)
* like cards
* clicking the card photo enlarges the photo via a modal
* modals can be closed by pressing escape, clicking outside of the overlay of the modal, or by clicking the X icon in the top right corner
* users will remain signed in when they close the app in one tab then open the app in another tab (JSON web tokens and localStorage)
* responsive design

---

## Frontend Technologies
The frontend of *Around the U.S.* was built with React. It uses:
* functional components
* hooks: states, contexts, effects
* JSON web tokens: tokens are saved in localStorage to simplify the authentication process for returning users
* page navigation done with a switch, routes, and protected routes
* an Api class with methods for each API call
* promises: then statements to handle responses, and catch statements to handle errors

---

## Backend Technologies
The backend of the *Around the U.S.* uses Express.js and MongoDB.

### Infrastructure/security/misc

* all requests and errors are logged with winston/winston-express
* DDoS protection with a request limit
* HTTP headers set with the helmut library
* enabled CORS
* auth middleware protects all routes (except signin and signup) which checks for a token in the request's authorization header
* simplify errors with ErrorManager class and centralized error handling
* uniform formatting with eslint (airbnb)

---

### Validation middlewares
All incoming data is validated with the celebrate library before reaching the controllers. If the request has invalid data, the controller will not run. For example, the card ID is required in order to like/dislike a card. The card ID must meet the following conditions to be considered valid:
* must be a string type
* must be at least 20 characters
* an ID is required

Please see /backend/middlewares/cards-validate and /backend/middlewares/users-validate to see the data requirements

---

### Mongoose/Schemas/Controllers
Mongoose is used to interact with our database (MongoDB) using JavaScript. It enables us to:
* create schemas and models
* use mongoose methods to perform CRUD operations: create, findById, FindByIdAndRemove, etc.
* connect the user model and the card model. Each card has an owner property which is the user's ID

---

### JSON web tokens
JSON web tokens are used for authentication in the backend. A token gets created when a user signs in. The auth middleware checks to make sure each request (excluding signin and signup) has an authorization header with a valid token. If the request doesn't have a token or an authorization header, the request is considered invalid and will not be executed.

---

### Bcryptjs
Bcryptjs is used to protect the user's password. The user's password is hashed with a 10 character salt before being stored in the database. 

---

## Deployment
*Around the U.S.* is deployed with Google Cloud. It features HTTPS protocol via SSL certificates and redirects requests using NGINX. The app can be viewed at:<br><br>
[around-the-us.students.nomoreparties.site](https://around-the-us.students.nomoreparties.site)<br />
[www.around-the-us.students.nomoreparties.site](https://www.around-the-us.students.nomoreparties.site)

---

## Getting started - development
1. copy the repository on your machine
2. run 'npm i' from the frontend and backend directory
3. run 'npm run dev' from to launch the backend
4. run 'npm run start' from to launch the frontend
5. that's it. have fun!!


