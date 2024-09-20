const mongoose=require('mongoose')
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

const User=mongoose.model("user",userSchema)

module.exports=User;