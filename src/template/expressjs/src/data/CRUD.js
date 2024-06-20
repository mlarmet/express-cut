const pool = require("../config/db.config");

const get = {
	async All(tableName) {
		const sql = `SELECT * FROM ${tableName}`;
		try {
			const [res] = await pool.execute(sql);
			return res || [];
		} catch (err) {
			return { res: false, mess: err };
		}
	},

	async AllById(tableName, fieldName, id) {
		const sql = `SELECT * FROM ${tableName} WHERE ${fieldName} = ?`;
		try {
			const [res] = await pool.execute(sql, [id]);
			return res || [];
		} catch (err) {
			return { res: false, mess: err };
		}
	},

	async OneById(tableName, fieldName, id) {
		const sql = `SELECT * FROM ${tableName} WHERE ${fieldName} = ?`;

		try {
			const [res] = await pool.execute(sql, [id]);
			return res[0] || {};
		} catch (err) {
			return { res: false, mess: err };
		}
	},
};

const put = {
	async OneFieldById(tableName, fieldName, id, updateField, value) {
		const sql = `UPDATE ${tableName} SET ${updateField} = ? WHERE ${fieldName} = ?`;
		try {
			const [res] = await pool.execute(sql, [value, id]);
			return res[0] || {};
		} catch (err) {
			return { res: false, mess: err };
		}
	},
};

const del = {
	async All(tableName) {
		const sql = `DELETE FROM ${tableName}; ALTER TABLE ${tableName} AUTO_INCREMENT = 1;`;
		try {
			const [res] = await pool.query(sql);
			return res || [];
		} catch (err) {
			return { res: false, mess: err };
		}
	},

	async ResetId(tableName) {
		const sql = `ALTER TABLE ${tableName} AUTO_INCREMENT = 1;`;
		try {
			const [res] = await pool.query(sql);
			return res || [];
		} catch (err) {
			return { res: false, mess: err };
		}
	},

	async OneById(tableName, fieldName, id) {
		const sql = `DELETE FROM ${tableName} WHERE ${fieldName} = ?`;
		try {
			const [res] = await pool.execute(sql, [id]);
			return res[0] || {};
		} catch (err) {
			return { res: false, mess: err };
		}
	},
};

module.exports = {
	get,
	del,
	put,
	pool,
};
