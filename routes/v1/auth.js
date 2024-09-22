const express = require('express');
const passport = require('passport'); 
require('../../utils/passport');
const { handleLogin,
  handleSignup,
  handleReset,
  verifyEmail,
  handleLogout,
  changePassword,
  successGoogleLogin,
  failureGoogleLogin,
  sendPdf } = require('../../controllers/auth');

const router = express.Router();



router.use(passport.initialize()); 
router.use(passport.session());

router
  .route('/login')
  .post(handleLogin)
router
  .route('/logout')
  .get(handleLogout)
router
  .route('/signup')
  .post(handleSignup)
router
  .route('/reset')
  .post(handleReset)
router
  .route('/change')
  .post(changePassword)
router
  .route('/user/verify/:id/:token')
  .get(verifyEmail)



// Auth 
router.get('/auth/google' , passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
})); 

// Auth Callback 
router.get( '/auth/google/callback', 
	passport.authenticate( 'google', { 
		successRedirect: '/success', 
		failureRedirect: '/failure'
}));

// Success 
router.get('/success' , successGoogleLogin); 

// failure 
router.get('/failure' , failureGoogleLogin);

//generate invoice
router
  .route('/pdf')
  .post(sendPdf)


module.exports = router;