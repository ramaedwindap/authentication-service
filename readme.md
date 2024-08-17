# Authentication Service

An authentication system using Express, Prisma, TypeScript, Joi, JWT, Bcrypt, and Supertest. The service includes user registration, login, profile user, and token refresh functionality. The codebase follows best practices with separation of concerns, clear structure, and error handling.

## Table of Contents

-   [Features](#features)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
    -   [Database Setup](#database-setup)
    -   [Running the Application](#running-the-application)
-   [API Documentation](#api-documentation)
    -   [Register](#register)
    -   [Login](#login)
    -   [Get Profile](#get-profile)
    -   [Refresh Token](#refresh-token)
-   [Testing](#testing)
    -   [Test Summary](#test-summary)
-   [Error Handling](#error-handling)
-   [Logging](#logging)
-   [Acknowledgments](#acknowledgments)
-   [Disclaimer](#disclaimer)

## Features

-   **User Registration**: Securely register users with validation checks on username, email, and password.
-   **User Login**: Authenticate users and generate JWT access and refresh tokens.
-   **Profile User**: Retrieve user profile information using JWT authentication.
-   **Token Refresh**: Generate a new access token using a valid refresh token.
-   **Error Handling**: Custom error handling for validation errors, JWT errors, and Prisma client errors.
-   **Logging**: All major events are logged using Winston.

## Getting Started

### Prerequisites

-   Node.js (>=20.x.x)
-   npm (>=10.x.x) or yarn
-   MySQL or any other supported Prisma database

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/ramaedwindap/authentication-service.git
    cd authentication-service
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

    or

    ```sh
    yarn install
    ```

### Environment Variables

Create a `.env` file in the root directory and configure the following environment variables:

```plaintext
DATABASE_URL=mysql://user:password@localhost:3306/database_name
ACCESS_TOKEN_SECRET_KEY=your_access_token_secret
REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret
PORT=3001
```

### Database Setup

1. Run the Prisma migrations to set up the database schema:

    ```sh
    npx prisma migrate dev
    ```

2. Generate the Prisma client:

    ```sh
    npx prisma generate
    ```

### Running the Application

Start the application:

```sh
npm run build
```
then

```sh
npm run start
```

The application will start on the port defined in the `.env` file (default is `3001`).

## API Documentation

### Register

-   **Endpoint**: `/api/auth/register`
-   **Method**: `POST`
-   **Request Body**:

    ```json
    {
        "username": "your_username",
        "email": "your_email@example.com",
        "password": "your_password",
        "password_confirmation": "your_password",
        "is_active": true,
        "created_at": "2024-08-11T12:00:00Z"
    }
    ```

-   **Response**:

    ```json
    {
        "code": 201,
        "status": "CREATED",
        "message": "Success create an account",
        "data": {
            "uuid": "user_uuid",
            "username": "your_username",
            "email": "your_email@example.com",
            "provider": "local"
        }
    }
    ```

### Login

-   **Endpoint**: `/api/auth/login`
-   **Method**: `POST`
-   **Request Body**:

    ```json
    {
        "email": "your_email@example.com",
        "password": "your_password"
    }
    ```

-   **Response**:

    ```json
    {
        "code": 200,
        "status": "OK",
        "message": "Success login",
        "data": {
            "user": {
                "uuid": "user_uuid",
                "username": "your_username",
                "email": "your_email@example.com",
                "provider": "local"
            },
            "accessToken": "your_access_token",
            "refreshToken": "your_refresh_token"
        }
    }
    ```

### Get Profile

-   **Endpoint**: `/api/auth/get-profile`
-   **Method**: `GET`
-   **Headers**:

    ```plaintext
    Authorization: Bearer your_access_token
    ```

-   **Response**:

    ```json
    {
        "code": 200,
        "status": "OK",
        "message": "Success get user",
        "data": {
            "uuid": "user_uuid",
            "username": "your_username",
            "email": "your_email@example.com",
            "provider": "local"
        }
    }
    ```

### Refresh Token

-   **Endpoint**: `/api/auth/refresh-token`
-   **Method**: `POST`
-   **Request Body**:

    ```json
    {
        "refreshToken": "your_refresh_token"
    }
    ```

-   **Response**:

    ```json
    {
        "code": 200,
        "status": "OK",
        "message": "Success generate access token",
        "data": {
            "accessToken": "your_new_access_token"
        }
    }
    ```

## Testing

### Test Summary

This project uses `supertest` in combination with `Jest` to perform API endpoint testing. Below is a summary of the test results, showcasing the coverage and effectiveness of the tests:

```plaintext
Auth API Endpoints
    POST /api/auth/register
      ✓ should register a new user with valid data (97 ms)
      ✓ should fail registration if email already exists (10 ms)
      ✓ should fail registration with invalid username format (3 ms)
      ✓ should fail registration if passwords do not match (4 ms)
    POST /api/auth/login
      ✓ should login with valid credentials (62 ms)
      ✓ should fail login with invalid credentials (59 ms)
      ✓ should fail login with non-existent email (3 ms)
    GET /api/auth/get-profile
      ✓ should get profile with valid access token (4 ms)
      ✓ should fail to get profile with invalid access token (2 ms)
      ✓ should fail to get profile without access token (2 ms)
    POST /api/auth/refresh-token
      ✓ should refresh access token with valid refresh token (4 ms)
      ✓ should fail to refresh access token with invalid refresh token (2 ms)
      ✓ should fail to refresh access token without refresh token (2 ms)
    AuthController Error Handling
      ✓ should handle errors in register controller (7 ms)
      ✓ should handle errors in login controller (1 ms)

-------------------------------|---------|----------|---------|---------|-------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------------|---------|----------|---------|---------|-------------------
All files                      |   91.66 |       60 |   88.88 |   91.61 |
-------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        1.025 s, estimated 11 s
```

This summary demonstrates the thoroughness of the tests, covering various scenarios including success cases, validation errors, and error handling.

## Error Handling

The application handles various errors, including:

-   **Validation Errors**: Joi validation errors return a `422 Unprocessable Entity` status.
-   **JWT Errors**: Token errors like expiration and invalid tokens return a `401 Unauthorized` status.
-   **Database Errors**: Prisma client errors return a `500 Internal Server Error` status.

## Logging

The application uses Winston for logging. Logs include information about requests, errors, and database queries.

## Acknowledgments

Special thanks to [Rafi Putra Ramadhan](https://raprmdn.dev/) for providing valuable information on implementing accessToken and refreshToken. Your insights were greatly appreciated and have been instrumental in shaping this project.

## Disclaimer

I am currently learning TypeScript, and I acknowledge that there might be in this project where the implementation could be improved, particularly in the use of types and the frequent use of `any`. I am open to any advice, suggestions, or discussions to help improve this project and learn together. Feel free to reach out or contribute!
