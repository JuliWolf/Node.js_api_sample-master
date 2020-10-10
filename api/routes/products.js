// Подключение. Основные библиотеки
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth.js');

// Настройка хранилища файлов
const storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, './uploads/');
	},
	filename: function (req, file, cb){
		cb(null, Date.now() +"-"+ file.originalname);
	}
})

// Фильтр для файлов
const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
		cb(null, true);
	}else{
		cb(null, false);
	}
}

const upload = multer({ 
	storage: storage, 
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});




// Подключение. Схема\Модель сущности продукт.  
const Product = require('../models/product');




// Обработка запроса POST по адресу /products ( Добовление продукта )
router.post('/', checkAuth, upload.single('productimage') , (req, res, next) => {
	// Создание сущности продукта с параметрами из тела запроса
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});
	
	// Сохранение сущности продукта в базу, 
	// логирование и отлов ошибок
	product.save()
		.then(result => {
			console.log(result);
			
			// Ответ
			res
				.status(201)
				.json({
					message: "Product created",
					createdProduct: {
						name: result.name,
						price: result.price,
						_id: result._id,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/products/' + result._id
						}
					}
				})

		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		});
});


// Обработка запроса GET по адресу /products ( Запрос всех продуктов )
router.get('/', (req, res, next) => {
	Product.find()
		.select('name price _id productImage')
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				products: docs.map(doc=>{
					return {
						name: doc.name,
						price: doc.price,
						_id: doc._id,
						productImage: doc.productImage,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/products/' + doc._id
						}
					}
				})
			}
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		});
});


// Обработка запроса GET по адресу /products с указанием id  ( Запрос продукта по id )
router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
	.select('name price _id productImage')
	.exec()
	.then(doc => {
		console.log(doc);
		if(doc){
			res.status(200).json({
				product: doc,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products'
				}
			});
		}else{
			res.status(404).json({message: 'No valid answer'})
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
})

// Обработка запроса DELETE по адресу /products с указанием id  ( Удаление продукта по id )
router.delete('/:productId', checkAuth, (req, res, next) => {
	const id = req.params.productId;
	Product.remove({_id: id})
	.exec()
	.then(resuls => {
		res.status(200).json({
			message: "Product deleted!",
			request: {
				type: 'POST',
				url: 'http://localhost:3000/products',
				data: {
					name: 'String',
					price: 'Number'
				}
			}
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		})
	});
});

// Обработка запроса PATCH по адресу /products с указанием id  ( Изменение продукта по id )
router.patch('/:productId', checkAuth, upload.single('productimage'), (req, res, next) =>{
	const id = req.params.productId;
	
	const updateOps = {
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	};

	Product.update({_id: id}, { $set: updateOps })
	.exec()
	.then(result => {
		console.log(result);
		res.status(200).json({
			message: 'Product updated!',
			request: {
				type: 'GET',
				url: 'http://localhost:3000/products/'+ id
			}
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	})
})



// экспорт объекта маршрута 
module.exports = router;