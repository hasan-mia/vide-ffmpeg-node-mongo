# MVC Pattern with REACT, EXPRESS and MONGOSE

# Folder Stracture
index
config
    -connection.js
controllers
    -AuthController.js
middleware
    -verifyJWT
    -limiter
models
    -User.js
public
    -index.html
    -404.html
routes
    -api
        -v1
            -auth.route.js
views
    -public
    -src
        -app.js
        -index.css
        -index.js
env

## Uses tools for server / rest api
### bcrypt
### express
### express-rate-limit
### helmet
### jsonwebtoken
### mongoose
### morgan
### nodemon
### helmet

## Uses tools for cient/frontend
### react
### react router dom
### splidejs
### rsuitjs
### tailwind

## ENV Setup and change value
NODE_ENV=development
DATABASE_URL=mongodb+srv://database:password@cluster0.ngw4z7m.mongodb.net/?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET="YmAb0fJLyOVdX5jWL4rRJc3CN41ZA1b/J8QRYaTGC4C/yR34b7lTEQDmlZKVJEO1gnHbV=="

## Generate secret totken
openssl rand -base64 128

## Install Dependencies
yarn 
or
npm install

## Serve with at http://localhost:5000
yarn server
or
npm run server

## Client with at http://localhost:3000
cd views (To go views directory and run)

yarn start
or
npm start

## build for production with minification
yarn build
or
npm run build

## Authentication API reference

### Register a new User 
http://localhost:5000/api/v1/auth/register
Method: POST
Body: 
{
  "username": "example",
  "email": "example@example.com",
  "password": "123456"
}
Response: 
{
  "success": true,
  "message": "Register successfully",
  "user": {
    "username": "example",
    "email": "example@example.com",
    "password": "$2b$10$gWTnSx344U0OHNekYWte8sGYeet7vUAvQMzf9MYaYGJGJmXKIITbdAD.",
    "profilePicture": "",
    "coverPicture": "",
    "followers": [],
    "followings": [],
    "isAdmin": false,
    "_id": "63dd4c8e69db19249b457fa535",
    "createdAt": "2023-02-03T18:03:58.918Z",
    "updatedAt": "2023-02-03T18:03:58.918Z",
    "__v": 0
  }
}

### Login User 
http://localhost:5000/api/v1/auth/login
Method: POST
Body: 
{
  "username": "example",
  "password": "123456"
}
or
{
  "email": "example@example.com",
  "password": "123456"
}

Response: 
{
  "success": true,
  "message": "login success",
  "data": {
    "_id": "63dd39ac1b647661ecfa225a",
    "username": "admin",
    "email": "admin@admin.com",
    "password": "$2b$10$gWTnSx344U0OHNekYWte8sGYeet7vUAvQMzf9MYaYGJGJmXKIITbdAD.",
    "profilePicture": "",
    "coverPicture": "",
    "followers": [],
    "followings": [],
    "isAdmin": false,
    "createdAt": "2023-02-03T16:43:24.460Z",
    "updatedAt": "2023-02-03T16:43:24.460Z",
    "__v": 0
  }
}

