const express = require('express');
const Product = require('../models/product');
const mongoose = require('mongoose');
const domain = 'http://localhost:3000/'; 
const router = express.Router();


router.get('/', (req, res, next) => {
	Product.find()
			.select('name price _id productImage')
			.exec()
			.then((docs) => {
				const response = {
					count: docs.length,
					products: docs.map(doc => {

						return {
							name: doc.name,
							price: doc.price,
							_id: doc._id,
							productImage: doc.productImage,
							request: {
								type: 'GET',
								url: `${domain}products/${doc._id}`
							}
						}
					})
					
				};
				res.status(200).json(response);
			})
			.catch((error) => {
				res.status(500).json(error);
			});
	
});

router.post('/', (req, res, next) => {
	
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
		
	});
	product.save()
	.then( result => {
		console.log(result);
		res.status(201).json({
			message: 'handling POST request to /products',
			createdProduct: result
		});
	})
	.catch(err => {
		console.log(err)
		res.status(500).json({
			error: err
		});
	});
	
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;

	Product.findById(id)
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
router.patch('/:productId', (req, res, next) => {
		const id = req.params.productId;
		const updateOPs = {};
		for(const ops of req.body){
			updateOPs[ops.propName] = ops.value;
		}
		Product.update({_id: id}, { $set: updateOPs })
				.exec()
				.then( result => {
					console.log(result);
					res.status(200).json(result);
				})
				.catch( err => {
					console.log("we found errors");
					res.status(500).json(err);
				});

});
router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.remove({
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
