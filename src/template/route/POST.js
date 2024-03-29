
//== START POST ==
//create one
router.post("/", async (req, res) => {
	const body = req.body;
	
	//TODO : check body fields
	if (!body) {
		res.status(400).send({ res: false, message: "body not valid" });
		return;
	}

	//FIXME : set fields
	const sql = "INSERT INTO " + tableName + " (x,x,x) VALUES (?, ?, ?)";

	//FIXME : set values
	try {
		const [data] = await pool.execute(sql, [body, body, body]);
		res.status(200).send({ res: true, message: "success post " + tableName });
	} catch (err) {
		res.status(400).send({ res: false, message: "error post " + tableName, err: err });
	}
});
//== END POST ==
