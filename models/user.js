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
        },
        verified: {
            type: Boolean,
            default: false,
          },
        accounttype: {
            type: String,
            default: "local",
          },
    }
)

const User=mongoose.model("user",userSchema)

module.exports=User;