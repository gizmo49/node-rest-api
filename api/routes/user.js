const express = require('express');
const mongoose = require ('mongoose');

const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');


router.post('/signup', (req, res, next) => {

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    
       });
    
            
        user.save()
            .then((result) => {
                res.status(200).json({
                    messgae : "user created"
                })
            })
            .catch((error) => {
                console.log('wetin sup');
                res.status(500).json({
                    error: error
                })
            })
  
});

router.delete('/:userId', (req,res,next) => {
    const id = req.params.userId;
    User.remove({
		_id: id
	}).exec()
	  .then((result) => {
		  res.status(200).json(result); 
	  })
	  .catch((err) => {
		res.status(500).json({
			"message": "could not delete"
		});
	  });
});

module.exports = router;