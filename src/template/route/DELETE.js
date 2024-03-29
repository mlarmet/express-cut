
//== START DELETE ==
//delete one with id
router.delete("/:id", async (req, res) => {
	const id = req.params.id;

	if (isNaN(id)) {
		res.status(400).send({ res: false, message: "id param not valid" });
		return;
	}

	//FIXME : set id
	const sql = "DELETE FROM " + tableName + " WHERE id = ?";

	try {
		const [data] = await pool.execute(sql, [id]);
		res.status(200).send({ res: true, message: "success delete " + tableName });
	} catch (err) {
		res.status(400).send({ res: false, message: "error delete " + tableName, err: err });
	}
});
//== END DELETE ==
