const express = require("express");
const router = express.Router();

const { verifyToken } = require("../utils/verifyToken");
const { get%%route_name_cap%% } = require("../data/%%route_name%%");

//default route : "/%%route_name%%"

//get all %%route_name%%
router.get("/", verifyToken, async (req, res) => {
	const %%route_name%%s = await get%%route_name_cap%%.All();

	return res.status(200).send(%%route_name%%s);
});

//get one %%route_name%% with id
router.get("/:id", verifyToken, async (req, res) => {
	const id = parseInt(req.params.id);

	if (isNaN(id)) {
		res.status(400).send({ message: "id param not valid" });
		return;
	}

	const %%route_name%% = await get%%route_name_cap%%.OneById(id);

	return res.status(200).send(%%route_name%%);
});

module.exports = router;
