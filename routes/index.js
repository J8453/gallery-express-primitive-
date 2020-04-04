var express = require('express');
var router = express.Router();

const fs = require('fs');

const User = require('../model/user.js');
const Avatar = require('../model/avatar.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	const uidFromSession = req.session.userID;
	res.render('index', {
		uidFromSession
	})
});

/* Handle Login */
router.post('/login', function(req, res, next) {
	const formData = req.body;
	User.findOne({
		where: {
			userID: formData.ID,
			password: formData.password
		}
	}).then(data=>{
		 if (data) {
		 	req.session.userID = formData.ID;
		 	res.redirect('/');
		 } else {
		 	res.redirect('/');
		 }
	}).catch(err=>{
		console.log(err);
		res.redirect('/');
	})	
})

router.post('/login/fromProfile', function(req, res, next) {
	const queryUser = req.query.user; 
	const formData = req.body;
	User.findOne({
		where: {
			userID: formData.ID,
			password: formData.password
		}
	}).then(data=>{
		 if (data) {
		 	req.session.userID = formData.ID;
		 	res.redirect(`/profile?user=${queryUser}`);
		 } else {
		 	res.redirect(`/profile?user=${queryUser}`);
		 }
	}).catch(err=>{
		console.log(err);
		res.redirect(`/profile?user=${queryUser}`);
	})		
})

/* Handle Register */
router.post('/register', function(req, res, next) {
	const formData = req.body;
	User.create({
		userID: formData.ID,
		password: formData.password
	})
		.then(data=>{
			Avatar.create({
				src: `/uploads/${formData.ID}/avatar.jpg`, // 現在的做法好像不需要這張表，但總之先留著
				userId: data.dataValues.id.toString()
			})
		})
		.then(()=>{
			fs.mkdir(`public/uploads/${formData.ID}`, { recursive: true }, (err) => {
			  if (err) throw err;
			});
			res.redirect('/');
		})
		.catch(err=>{
			console.log(err);
			res.redirect('/');
		})
})

router.post('/register/fromProfile', function(req, res, next) {
	const queryUser = req.query.user; 
	const formData = req.body;
	User.create({
		userID: formData.ID,
		password: formData.password
	})
		.then(data=>{
			Avatar.create({
				src:  `/uploads/${formData.ID}/avatar.jpg`,
				userId: data.dataValues.id.toString()
			})
		})
		.then(()=>{
			fs.mkdir(`public/uploads/${formData.ID}`, { recursive: true }, (err) => {
			  if (err) throw err;
			});
			res.redirect(`/profile?user=${queryUser}`);
		})
		.catch(err=>{
			console.log(err);
			res.redirect(`/profile?user=${queryUser}`);
		})
})

/* Handle Logout */
router.get('/logout', function(req, res, next){
	req.session.destroy();
	res.redirect('/');
})


module.exports = router;
