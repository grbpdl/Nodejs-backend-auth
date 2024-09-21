const User = require("../models/user");
const Otp = require("../models/otp");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/mail");
const { validateEmail, validatePassword } = require("../utils/formvalidator");
require('dotenv').config();

// Signup and register function
async function handleSignup(req, res) {
  try {
    const { email, password } = req.body;

    // Validate email and password
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError) return res.status(400).json({ msg: emailError });
    if (passwordError) return res.status(400).json({ msg: passwordError });

    // Check if the user already exists
    const userData = await User.findOne({ email });
    if (userData) {
      if (userData.verified) {
        return res.status(400).json({ msg: 'User with this email already exists!' });
      }
      return res.status(400).json({ msg: 'Verification email already sent to your email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({ email, password: hashPassword });

    // Create JWT token (expires in 1 hour)
    const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: user._id }, process.env.TOKEN_SECRET);

    // Send verification email
    await sendEmail(email, `<a href='${process.env.BASE_URL}/user/verify/${user._id}/${token}'>Verify here</a>`);

    return res.status(200).json({ msg: 'An Email has been sent to your account. Please verify it and proceed to login.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'An internal server error occurred.' });
  }
}

// Function to verify the email link
async function verifyEmail(req, res) {
  try {
    const { id, token } = req.params;
    const user = await User.findById(id);

    if (!user || !token) {
      return res.status(400).json({ msg: 'Invalid verification link.' });
    }

    // Decode the token and check expiration
    const decodedToken = jwt.decode(token);
    if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
      return res.status(400).json({ msg: 'Verification link expired. Please register again.' });
    }

    // Mark the user as verified
    await user.updateOne({ verified: true });
    return res.status(200).json({ msg: 'Email verified successfully. You may now log in.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'An internal server error occurred.' });
  }
}

// Function to handle login
async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Validate email and password
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError) return res.status(400).json({ msg: emailError });
    if (passwordError) return res.status(400).json({ msg: passwordError });

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User does not exist.' });
    if (!user.verified) return res.status(400).json({ msg: 'Please verify your email before logging in.' });

    // Check the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(400).json({ msg: 'Incorrect password.' });

    // Create a JWT token (1 hour)
    const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: user._id }, process.env.TOKEN_SECRET);

    // Set token in cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true
    };

    // Exclude password from response and return success
    user.password = undefined;
    return res.status(200).cookie("token", token, options).json({ success: true, token, user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'An internal server error occurred.' });
  }
}

// Function to handle logout
async function handleLogout(req, res) {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'An internal server error occurred.' });
  }
}

// Function to handle reset password
async function handleReset(req, res) {
  try {
    const { email } = req.body;

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ msg: emailError });

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User does not exist.' });

    // Generate OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
    const otpData = new Otp({ email, code: otpCode, expireIn: new Date().getTime() + 300 * 1000 });

    await otpData.save();
    await sendEmail(email, `<p>Your OTP code is: ${otpCode}</p>`);

    return res.status(200).json({ msg: 'OTP sent successfully to your email.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'An internal server error occurred.' });
  }
}

// Function to change password
async function changePassword(req, res) {
  try {
    const { code, password } = req.body;

    // Validate inputs
    if (!code) return res.status(400).json({ msg: 'Please enter OTP.' });
    if (!password) return res.status(400).json({ msg: 'Please enter a new password.' });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ msg: passwordError });

    // Find the OTP entry
    const otpEntry = await Otp.findOne({ code });
    if (!otpEntry) return res.status(400).json({ msg: 'Invalid OTP.' });

    // Check if OTP has expired
    const currentTime = new Date().getTime();
    if (otpEntry.expireIn < currentTime) {
      return res.status(400).json({ msg: 'OTP has expired.' });
    }

    // Find the user and update their password
    const user = await User.findOne({ email: otpEntry.email });
    if (!user) return res.status(400).json({ msg: 'User not found.' });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    user.password = hashPassword;
    await user.save();

    // Remove OTP entry after successful password reset
    await Otp.findByIdAndRemove(otpEntry._id);

    return res.status(200).json({ msg: 'Password changed successfully.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'An internal server error occurred.' });
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
