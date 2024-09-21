const User = require("../models/user");
const Otp = require("../models/otp");
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
      return res.status(400).json({ msg: 'User with given email already exist!' });
    // check if verification email already sent
    if (userData && userData.verified == false)
      return res
        .status(400)
        .json({ msg: 'verification email has been already sent to your email' });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //saving on the database
    const user = await User.create(
      {
        email: req.body.email,
        password: hashPassword
      }
    )
    // creating jwt  token that expires in 1 hour
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: user._id
    }, process.env.TOKEN_SECRET);



    await sendEmail(req.body.email, `<a href='${process.env.BASE_URL}/user/verify/${user._id}/${token}'>verify here</a>`);

    res.status(200).json({ msg: 'An Email sent to your account please verify and proceed to login' });

  } catch (error) {
    console.log(error)
    res.status(400).json({ msg: error.message });
  }
}


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
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!(email && password)) {
      return res.status(400).send("All fields are required");
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user is not found
    if (!user) {
      return res.status(400).json({ msg: 'user doesnot exist' });
    }
    if ((user.verified == false))
      return res.status(400).json({ msg: 'verify before login!' });


    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If the password does not match
    if (!isPasswordMatch) {
      return res.status(400).json({ msg: 'password doesnot match' });
    }

    // Create JWT token
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token expires in 1 hour
      data: user._id
    }, process.env.TOKEN_SECRET);

    // Assign token to user object, and exclude password from response
    user.token = token;
    user.password = undefined;

    // Cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true // Cookie cannot be accessed via client-side scripts
    };

    // Send the response with token and user information
    return res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'An internal server error occurred' });
  }
}


//function to handle reset password
async function handleLogout(req, res) {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {

  }
}

//resetting the password
async function handleReset(req, res) {
  try {
    const { email } = req.body;

    // Check if both email and password are provided
    if (!(email)) {
      return res.status(400).send("All fields are required");
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user is not found
    if (!user) {
      return res.status(400).json({ msg: 'user doesnot exist' });
    }
    const otpCode = Math.floor((Math.random() * 10000) + 1)
    const otpData = new Otp({
      email: req.body.email,
      code: otpCode,
      expireIn: new Date().getTime() + 300 * 1000
    })
    await otpData.save()
    if (user)
      await sendEmail(user.email, `<p> your otp code is:${String(otpCode)}`);

  } catch (error) {
    res.status(500).send(error);
  }
}

async function changePassword() {
  try {
    const data = await Otp.findOne({ code: req.body.code })

    if (!data) return res.status(400).json({ msg: 'invalid ' })

    if (data) {
      const currentTime = new Date().getTime()
      const diff = data.expireIn - currentTime
      if (diff < 0) {
        res.status(400).json({ msg: 'otp expired' })
      }
    }

    let email;
    if (data) {
      email = data.email;
    }
    //hash password
    const user = await User.findOne({ email })

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    if (user) {
      user.password = hashPassword
      await user.save()
    }

    res.status(200).json({ msg: 'password changed successfully' })
    const otpId = data._id
    await Otp.findByIdAndRemove(otpId);
  } catch (error) {
    res.status(400).send({ msg: "error 400 occured" });
  }
}

module.exports = {
  handleLogin,
  handleSignup,
  handleReset,
  verifyEmail,
  handleLogout,
  changePassword

};