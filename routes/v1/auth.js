const express = require('express');
const { handleLogin,handleSignup,handleReset , verifyEmail} = require('../../controllers/auth');

const router = express.Router();


router
  .route('/login')
  .post(handleLogin)
router
  .route('/signup')
  .post(handleSignup)
router
  .route('/reset')
  .post(handleReset)
router
  .route('/user/verify/:id/:token')
  .get(verifyEmail)
module.exports = router;