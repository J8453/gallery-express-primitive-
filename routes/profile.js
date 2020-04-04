var express = require('express');
var router = express.Router();

const User = require('../model/user.js');
const Album = require('../model/album.js');
const Image = require('../model/image.js');


router.get('/', async function(req, res, next) {
	const uidFromSession = req.session.userID;
	const queryUser = req.query.user; 
	let idInUser;

	User.findOne({
		attributes: ['id'],
		where: {
			userID: queryUser
		}
	})
		.then(data=>data.dataValues.id)
		.then(user_id=>{
			idInUser = user_id;
			// console.log(idInUser);

			Album.findAll({
				where: {
					userId: user_id
				}
			})
				.then(dataArr=>{
					const albumArr = [];
					dataArr.forEach(data=>{
						albumArr.push(data.dataValues);
					});

					// console.log(albumArr); 

					res.render('profile',{
						uidFromSession,
						queryUser,
						idInUser,
						albumNum: albumArr.length,
						albumArr,
					})
				})
		})
		.catch(err=>{
			console.log(err);
		})
});




module.exports = router;
