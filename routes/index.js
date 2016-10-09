const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const models= require('../models');
const Message = models.Messages;
module.exports = router;

router.post('/', function (req,res,next) {
	 
	Message.create({
		token : req.body.token,
		title : req.body.title,
		content : req.body.content,
		time : req.body.time
	})
	.then(message => {
		const response = {
			message: message,
			log: "Message saved"
		};
		res.send(response);
	})
	.catch(function(err) {
		console.log(err)
	});
});


