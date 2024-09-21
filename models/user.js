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
        },
        verified: {
            type: Boolean,
            default: false,
          },
    }
)

const User=mongoose.model("user",userSchema)

module.exports=User;