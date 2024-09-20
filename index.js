const express = require('express')
require('dotenv').config()
const mongoose=require('mongoose')

mongoose.connect(process.env.MONGO_DATABASE_URI)
.then((result) => {
    console.log("connected"+result)
}).catch((err) => {
    console.log("error ocured" + err)
});

const app = express()
const port = process.env.PORT
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/login', async (req, res) => {
    const body=req.body
    console.log(body)
 await USER.create({
    email:"samplae",
    password:"password"
 })
 res.status(201).json({
   msg: "created user sucessfully"
 })
}) 

app.listen(port, () => {
  console.log(`Server Sucessfully started on : http://localhost:${port}`)
})

const userSchema= new mongoose.Schema(
    {
        email:{
            type:String,
            requierd:true,
            unique:true,
        },
        password:{
            type:String,
            requierd:true
        }
    }
)

const USER=mongoose.model("user",userSchema)