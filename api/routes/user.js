// Подключение. Основные библиотеки
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth.js');

const User = require('../models/user.js');

// Обработка запроса POST по адресу /signup ( Добовление пользователя )
router.post('/signup', (req, res, next) => {
	User.find({email: req.body.email})
		.exec()
		.then(user => {
			if(user.length >= 1){
				return res.status(409).json({
					message: 'Mail exists'
				})
			}else{
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if(err){
						return res.status(500).json({
							error: err
						});
					}else{
				const user = new User({
					_id: new mongoose.Types.ObjectId(),
					email: req.body.email,
					password: hash
				})
				user
					.save()
					.then(result =>{
						console.log(result)
						res.status(201).json({
							message: "User created"
						})
					})
					.catch(err => {
						console.log(err)
						res.status(500).json({
							error: err
						})
					})
					}
				})
			}
		});
});

// Обработка запроса POST по адресу /login ( Получение токена авторизации )
router.post('/login', (req, res, next) => {
	User.find({email: req.body.email})
	.exec()
	.then(user => {
		if(user.length < 1){
			return res.status(401).json({
				message: 'Auth faild'
			})
		}
		bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
			if(err){
				return res.status(401).json({
					message: 'Auth faild'
				})
			}
			if(result){
				const token = jwt.sign({
						email: user[0].email,
						userId: user[0]._id
					}, 
					process.env.JWT_KEY,
					{ expiresIn: "1h" },
				 )
				return res.status(200).json({
					message: "Auth successful",
					token: token
				})
			}
			res.status(401).json({
				message: "Auth faild"
			})
		})
	})
	.catch()
});

// Обработка запроса DLETE по адресу /signup ( Удаление пользователя )
router.delete( "/:userId", checkAuth, (req, res, next) => {
	User.remove({_id: req.params.userId})
		.exec()
		.then(result => {
			res.status(200).json({
				message: "User deleted"
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		});
})



module.exports = router;