const mysql2 = require("mysql2/promise");

const mysql2_pool = {
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	multipleStatements: true,
	waitForConnections: true,
	connectionLimit: 30,
	queueLimit: 0,
};

const pool = mysql2.createPool(mysql2_pool);

module.exports = pool;
