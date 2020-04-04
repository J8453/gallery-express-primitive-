const Sequelize = require('sequelize');
const db = require('./db.js');

const User = db.define('user', {
	userID: {
		type: Sequelize.STRING
	},
	password: {
		type: Sequelize.STRING
	}
});

User.sync(); // CREATE TABLE IF NOT EXISTS

module.exports = User;