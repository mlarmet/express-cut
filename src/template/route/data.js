const { get } = require("./CRUD");

const tableName = "%%table_name%%";

const get%%route_name_cap%% = {
	async All() {
		return await get.All(tableName);
	},

	async OneById(id) {
		return await get.OneById(tableName, "id%%route_name_cap%%", id);
	},
};

module.exports = {
	get%%route_name_cap%%,
};
