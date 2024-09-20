const User = require("../models/user");


async function handleLogin(req,res){
    const body = req.body
    console.log(body)
    await User.create({
      email: body.email,
      password: body.password
    })
    res.status(201).json({
      msg: "created user sucessfully"
    })
}


module.exports={
handleLogin,
};