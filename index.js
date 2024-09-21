// importing requierd packages
const express = require('express')
require('dotenv').config()
var cookieParser = require('cookie-parser')
const cors=require('cors');
const session = require('express-session');







//connecting database
const {connectMongoDb}=require("./connection")
connectMongoDb();

//initializing the express
const app = express()


//importing the required things
const corsOptions ={
  origin:['http://localhost:3000',],
  credentials:true             //access-control-allow-credentials:true
}
const port = process.env.PORT
const authRouter=require("./routes/v1/auth")

// Middlewares required
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET 
}));

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
//all the routes of an app
app.use("/",authRouter);


//creating the server in the port
app.listen(port, () => {
  console.log(`Server Sucessfully started on : http://localhost:${port}`)
})

