
//== START PUT ==
//update one with id
router.put("/:id", async (req, res) => {
	const id = req.params.id;

	if (isNaN(id)) {
		res.status(400).send({ res: false, message: "id param not valid" });
		return;
	}

	const body = req.body;

	//TODO : check body fields
	if (!body) {
		res.status(400).send({ res: false, message: "body not valid" });
		return;
	}

	//FIXME : set fields and id
	const sql = "UPDATE " + tableName + " SET field = ? WHERE id = ?";

	//FIXME : set values
	try {
		const [data] = await pool.execute(sql, [body, id]);
		res.status(200).send({ res: true, message: "success put " + tableName });
	} catch (err) {
		res.status(400).send({ res: false, message: "error put " + tableName, err: err });
	}
});
//== END PUT ==
