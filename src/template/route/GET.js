
//== START GET ==
//get all
router.get("/", async (req, res) => {
	const sql = "SELECT * FROM " + tableName;

	try {
		const [data] = await pool.execute(sql);
		res.status(200).send({ res: true, message: "success get " + tableName, data: data });
	} catch (err) {
		res.status(400).send({ res: false, message: "error get " + tableName, err: err });
	}
});
//== END GET ==
