# Banao Technologies Assignment

This is a simple Express.js API for user authentication. It includes routes for user registration, login, password reset, and a demo route.

## Dependencies

- `express`: Web application framework for Node.js
- `bcrypt`: Library to hash passwords
- `jsonwebtoken`: An implementation of JSON Web Tokens
- `nodemailer`: Module for Node.js applications to allow easy email sending
- `dotenv`: Module that loads environment variables from a `.env` file into `process.env`

## Database Schema

The user schema is as usual but the post schema has a `parentId` which refers to the another postId which means its a comment and not the main post. This is used for Better DataBase Utilization.

![](https://raw.githubusercontent.com/YuvarajSingh-0/NodeJS-assign/ed175af0303d9bb0846ea9c74febeceaf6f69f80/models/ER-Model.svg)

## Routes

### User Registration

- **Endpoint:** `/register`
- **Method:** `POST`
- **Description:** Registers a new user by saving their username, email, and hashed password to the database.
- **Body Parameters:**
  - `username`: The username of the user
  - `email`: The email of the user
  - `password`: The password of the user

### User Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Logs in a user by checking if the username exists in the database and if the password is valid. If successful, a JWT token is signed and sent as a cookie.
- **Body Parameters:**
  - `username`: The username of the user
  - `password`: The password of the user

### Forgot Password

- **Endpoint:** `/forgot-password`
- **Method:** `POST`
- **Description:** Generates a password reset token and sends it to the user's email. This is a simple implementation. In a real-world application, you would want to send a password reset link to the user's email.
- **Body Parameters:**
  - `username`: The username of the user

### Reset Password

- **Endpoint:** `/reset-password/:token`
- **Method:** `POST`
- **Description:** Resets the user's password using the token sent to the user's email.
- **Body Parameters:**
  - `newPassword`: The new password of the user

### Get Posts

- **Endpoint:** `/`
- **Method:** `GET`
- **Description:** Fetches a paginated list of posts that have no parent post (i.e., top-level posts). The page number and limit can be specified as query parameters.

### Create Post

- **Endpoint:** `/`
- **Method:** `POST`
- **Description:** Creates a new post with the content passed in the request body. The author of the post is the currently authenticated user.
- **Body Parameters:**
  - `content`: The content of the post

### Update Post

- **Endpoint:** `/:id`
- **Method:** `PUT`
- **Description:** Updates the post with the given ID. The content of the post can be updated by passing it in the request body. The author of the post must be the currently authenticated user.
- **Body Parameters:**
  - `content`: The new content of the post

### Get Post

- **Endpoint:** `/:id`
- **Method:** `GET`
- **Description:** Fetches the post with the given ID.

### Post Comment

- **Endpoint:** `/comment`
- **Method:** `POST`
- **Description:** Posts a comment on the post with the given ID. The content of the comment and the ID of the post are passed in the request body. The author of the comment is the currently authenticated user.
- **Body Parameters:**
  - `content`: The content of the comment
  - `postId`: The ID of the post

### Get Comments

- **Endpoint:** `/:id/comments`
- **Method:** `GET`
- **Description:** Fetches a paginated list of comments on the post with the given ID. The page number and limit can be specified as query parameters.

### Like Post

- **Endpoint:** `/like`
- **Method:** `POST`
- **Description:** Likes the post with the given ID. The ID of the post is passed in the request body. The user who likes the post is the currently authenticated user.
- **Body Parameters:**
  - `postId`: The ID of the post

### Unlike Post

- **Endpoint:** `/unlike`
- **Method:** `POST`
- **Description:** Unlikes the post with the given ID. The ID of the post is passed in the request body. The user who unlikes the post is the currently authenticated user.
- **Body Parameters:**
  - `postId`: The ID of the post

### Delete Post

- **Endpoint:** `/:id`
- **Method:** `DELETE`
- **Description:** Deletes the post with the given ID. The author of the post must be the currently authenticated user.

## Usage

To use this API, import the router into your application and use it as middleware.

## Environment Variables

The following environment variables need to be set in a `.env` file:

- `SECRET_KEY`: The secret key used for signing JWT tokens
- `CLIENT_ID`: The client ID for OAuth2 authentication with Gmail
- `CLIENT_SECRET`: The client secret for OAuth2 authentication with Gmail
- `REFRESH_TOKEN`: The refresh token for OAuth2 authentication with Gmail
- `MONGODB`: The MongoDB connection URL