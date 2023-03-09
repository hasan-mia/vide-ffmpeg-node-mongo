# MVC Pattern with REACT, EXPRESS and MONGOSE

# Folder Stracture
index
public
    -upload
      -vieos

## Uses tools for server / rest api
### express
### ffmpeg-installer/ffmpeg
### fluent-ffmpeg
### mongoose
### multer

## ENV Setup and change your won credentials
NODE_ENV=development
HOST_URL=http://localhost:5001/
DATABASE_URL=mongodb+srv://databasename:password@cluster0.ngw4z7m.mongodb.net/?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET=YmAb0fJLyOVdX5jWL4rRJc3CN41ZA1b/J8E

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

### create a video post
http://localhost:5001/post
Method: POST
Body: From data
{
  "title": "example",
  "description": "example@example.com",
  "video": "your video"
}
Response: 
{
  "status": 201,
  "data": {
    "title": "example",
    "description": "description....,
    "video": {
      path: "localhost/5001/public/upload/videos/test.test.m3u8
    }
    "views": 0,
  }
}
