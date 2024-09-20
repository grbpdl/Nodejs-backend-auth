const express = require('express');
const { handleLogin } = require('../../controllers/user');

const router = express.Router();



router.get('/', (req, res) => {
  res.send('Hello World!')
})


router
  .route('/login')
  .post(handleLogin)

module.exports = router;