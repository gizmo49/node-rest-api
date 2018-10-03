const express = require('express');
const app = express();
const bodyPaser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const testRoutes = require('./api/routes/test');

//mongoose DB connection 

mongoose.connect('mongodb://node-shop:' + process.env.MONGO_ATLAS_PW + '@cluster0-shard-00-00-vdcp8.mongodb.net:27017,cluster0-shard-00-01-vdcp8.mongodb.net:27017,cluster0-shard-00-02-vdcp8.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true' +
	{
		useMongoClient: true
	});


app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.use(bodyPaser.urlencoded({extended:false}));
app.use(bodyPaser.json());

//handling cors errors

app.use((req,res,next) => {
	res.header(
		"Access-Control-Allow-Origin", "*"
	);
	res.header("Access-Control-Allow-Headers",
	"Origin, X-Requested-With, Content-type, Accept, Authorization"
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();

});
//Routes handling requests 
app.use('/test', testRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((res,req,next) => { 

	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});

});

module.exports = app;