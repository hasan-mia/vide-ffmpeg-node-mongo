require("dotenv").config() 
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const videoRoute = require("./routes/video.route")
// Mmiddleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// MongoDB URL
const dbUrl = process.env.DATABASE_URL;

// Port
const port = process.env.PORT || 6000

// ===================================//
//      Connect TO MONGOODB           //
//====================================//
mongoose.connect(dbUrl , {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
  console.log('connected db')
});

// ===================================//
//            API ROUTES              //
//====================================//
app.use('/video', videoRoute) 

// ===================================//
//            404 ROUTES              //
//====================================//
app.get('/', (req, res) => {
  res.send('Server is Running')
})
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});