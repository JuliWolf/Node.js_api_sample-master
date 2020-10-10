// Подключение. Основные библиотеки
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth.js');
const Order = require('../models/order.js');
const Product = require('../models/product.js');


// Обработка запроса POST по адресу /orders ( Добовление заказа )
router.post('/', checkAuth, (req, res, next) => {
	const id = req.body.productId;
	Product.findById(id)
	.then(product => {
		if(!product){
			return res.status(404).json({
				message: 'Product not found'
			})
		}
		productData = {...product};
		const order = new Order({
			_id: mongoose.Types.ObjectId(),
			quantity: req.body.quantity,
			product: req.body.productId
		});
		return order.save()
	})
	.then(result => {
			console.log(result);
			res.status(201).json({
				message: 'Order stored!',
				createdOrder:{
					_id: result._id,
					product: result.product,
					quantity: result.quantity
				},
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/'+ result._id
				}
			});
	})
	.catch(err => {
		res.status(500).json({
			message: 'Product not found',
			error: err
		})
	});

});


// Обработка запроса GET по адресу /orders ( Запрос всех заказов )
router.get('/', checkAuth, (req, res, next) => {
	Order.find()
	.select('product quantity _id')
	.populate('product', '_id name price')
	.exec()
	.then(docs => {
		res.status(200).json({
			count: docs.length,
			orders: docs.map(doc => {
				return {
					_id: doc._id,
					product: doc.product,
					quantity: doc.quantity,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/orders/'+ doc._id
					}

				}
			})
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err
		})
	})
});





// Обработка запроса GET по адресу /orders с указанием id  ( Запрос заказа по id )
router.get('/:orderId', checkAuth, (req, res, next) => {
	Order.findById(req.params.orderId)
	.populate('product')
	.exec()
	.then(order => {
		if(!order){
			res.status(404).json({
				message: "Order not found"
			})
		}
		res.status(200).json({
			order: order,
			request: {
				type: 'GET',
				url: 'http://localhost:3000/orders'
			}
		})
	})
	.catch(err => {
		res.status(500).json({
			error: err
		})
	})
});


// Обработка запроса DELETE по адресу /orders с указанием id  ( Удаление заказа по id )
router.delete('/:orderId', checkAuth, (req, res, next) => {
	Order.remove({_id: req.params.orderId})
	.exec()
	.then(result => {
		res.status(200).json({
			message: "Order successfully deleted",
			request: {
				type: 'POST',
				url: 'http://localhost:3000/orders',
				data: {
					productId: 'ID',
					quantity: 'Number'
				}
			}

		})
	})
	.catch(err => {
		res.status(500).json({
			error: err
		})
	})
});


// экспорт объекта маршрута 
module.exports = router;