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
const userRouter=require("./routes/v1/user")

// Middlewares required
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

//all the routes of an app
app.use("/user",userRouter);


//creating the server in the port
app.listen(port, () => {
  console.log(`Server Sucessfully started on : http://localhost:${port}`)
})

