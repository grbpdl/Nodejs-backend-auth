const express = require('express')
require('dotenv').config()

const userRouter=require("./routes/v1/user")
 const {connectMongoDb}=require("./connection")
connectMongoDb();
const app = express()
const port = process.env.PORT

// Add middleware to parse JSON and URL-encoded request bodies
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.use("/user",userRouter);

app.listen(port, () => {
  console.log(`Server Sucessfully started on : http://localhost:${port}`)
})

