const Sequelize = require('sequelize');
const db = require('./db.js');

const Image = db.define('image', { 
	src: {
		type: Sequelize.STRING
	},
	userId: {
		type: Sequelize.STRING
	},
	albumId: {
		type: Sequelize.STRING
	}
});

Image.sync();

module.exports = Image;