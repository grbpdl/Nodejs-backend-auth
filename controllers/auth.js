const User = require("../models/user");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/mail");
require('dotenv').config()

//signup and register functinon
async function handleSignup(req, res) {
  try {

    const userData = await User.findOne({ email: req.body.email });
// check if user already exist
    if (userData && userData.verified == true)
      return res.status(400).json({msg:'User with given email already exist!'});
// check if verification email already sent
    if (userData && userData.verified== false)
      return res
        .status(400)
        .json({msg:'verification email has been already sent to your email'});

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
   
//saving on the database
    const user=await User.create(
      {
        email:req.body.email,
        password: hashPassword
      }
    )
    // creating jwt  token that expires in 1 hour
    const token=jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: user._id
    }, process.env.TOKEN_SECRET);
    


    await sendEmail(req.body.email, `<a href='${process.env.BASE_URL}/user/verify/${user._id}/${token}'>verify here</a>`);
   
    res.status(200).json({msg:'An Email sent to your account please verify and proceed to login'});

  } catch (error) {
    console.log(error)
    res.status(400).json({ msg: error.message });
  }
}

//function to verify the email link
//function to verify the email link
async function verifyEmail(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const token = req.params.token;

    if (!user || !token) return res.status(400).json({ msg: 'Invalid link' });

    if (token) {
      const decodedToken = jwt.decode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const diff = decodedToken.exp - currentTime;

      if (diff < 0) {
        return res.status(400).json({ msg: 'Link expired, please register again' });
      }
    }

    // Update the user's verified status
    await user.updateOne({ verified: true });
    res.status(200).json({ msg: 'Email verified successfully, proceed to login' });

  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'An error occurred' });
  }
}


//functin to handle login
async function handleLogin(req, res) {
  try {
    console.log("login")
    
  } catch (error) {
    console.log(error)
  }
}

//function to handle reset password
async function handleReset(req, res) {
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


module.exports = {
  handleLogin,
  handleSignup,
  handleReset,
  verifyEmail,
};