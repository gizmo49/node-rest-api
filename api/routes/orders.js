const express = require('express');
const Product = require('../models/product');
const Order = require('../models/orders');
const mongoose = require('mongoose');
const domain = 'http://localhost:3000/'; 
const router = express.Router();


router.get('/', (req, res, next) => {
		Order.find()
			.select('product quantity _id')
			.exec()
			.then((docs) => {
				const response = {
					count: docs.length,
					orders: docs.map(doc => {

						return {
							product: doc.product,
							quantity: doc.quantity,
							_id: doc._id,
							request: {
								type: 'GET',
								url: `${domain}orders/${doc._id}`
							}
						}
					})
					
				};
				res.status(200).json(response);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
});

router.post('/', (req, res, next) => {
		const prodparam = req.body.productId;
		Product.findById(prodparam)
		.exec()
		.then((product) => {
			if(!product){
				res.status(404).json({
					message: "product unavailable",

				});
			}else{
				const order = new Order({
					_id: mongoose.Types.ObjectId(),
					quantity: req.body.quantity,
					product: req.body.productId
				});
				return order.save()
					 .then((result) => {
						 res.status(200).json({
							 message : "Order added Successfully",
							 createdOrder: {
								 _id: result.id,
								 product: result.product,
								 quantity: result.quantity
							 },
							 request:{
								type: 'GET',
								url: `${domain}orders/${result.id}`
							 }
						 });
					 })		
			}
		})
		.catch((errors) => {
			console.log("may not be a valid id");
			res.status(500).json(errors);
		});


	// 	 .catch((error) => {
	// 		 console.log("an error occured");
	// 		 res.status(500).json(error);
	// 	 });

	
});

router.get('/:orderId', (req, res, next) => {

	const id = req.params.orderId;

	Order.findById(id)
			.exec()
			.then((doc) => {
				if (doc){
					console.log(doc);
					res.status(200).json(doc);
				}else{
				
					res.status(404).json({"message": "document not found, not a valid ID"});
				}
				
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					"error": err
				});
			});
});

router.delete('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	Order.remove({
		_id: id
	}).exec()
	  .then((result) => {
		  res.status(200).json(result);
	  })
	  .catch((err) => {
		res.status(500).json({
			"message": "could not delete successfully"
		});
	  });
});


module.exports = router;
