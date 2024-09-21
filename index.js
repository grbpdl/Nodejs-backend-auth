// importing requierd packages
const express = require('express')
require('dotenv').config()



//connecting database
const {connectMongoDb}=require("./connection")
connectMongoDb();

//initializing the express
const app = express()


//importing the required things
const port = process.env.PORT
const authRouter=require("./routes/v1/auth")

// Middlewares required
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

//all the routes of an app
app.use("/",authRouter);


//creating the server in the port
app.listen(port, () => {
  console.log(`Server Sucessfully started on : http://localhost:${port}`)
})

