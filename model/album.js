const Sequelize = require('sequelize');
const db = require('./db.js');

const Album = db.define('album', { 
	name: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.STRING
	},
	userId: {
		type: Sequelize.STRING
	},
	coverSrc: {
		type: Sequelize.STRING
	}
});

Album.sync();

module.exports = Album;