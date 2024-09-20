const express = require('express');
const User = require('../../models/user');

const router=express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
  })
  router.post('/login', async (req, res) => {
      const body=req.body
      console.log(body)
   await User.create({
      email:body.email,
      password:body.password
   })
   res.status(201).json({
     msg: "created user sucessfully"
   })
  }) 

  module.exports=router;