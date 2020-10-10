// Подключение. Основные библиотеки
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Подключение. Мои маршруты
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// Настройка mongoose
mongoose.connect('mongodb://127.0.0.1:27017/node-shop', {useMongoClient: true});
mongoose.Promise = global.Promise

// Логи подключений и парсинг тела запросов
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Заголовки для разрешения кросдоменных запросов
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if(req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();	
});



// Обработка запросов к моим маршрутам
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);





// Обработка ошибок
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		err:{
			message: err.message
		}
	})
});

// Экспорт объекта express
module.exports = app;