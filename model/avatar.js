const Sequelize = require('sequelize');
const db = require('./db.js');

const Avatar = db.define('avatar', { 
	src: {
		type: Sequelize.STRING
	},
	userId: {
		type: Sequelize.STRING
	}
});

Avatar.sync();

module.exports = Avatar;