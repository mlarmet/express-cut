const jwt = require("jsonwebtoken");

/**
 * Call for each request to check if the token is valid
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns next() if the token is valid
 */
const verifyToken = async (req, res, next) => {
	if (process.env.NO_TOKEN === "1") {
		return next();
	}

	const token = req.cookies.token || null;

	if (token === null) {
		return res.status(401).json({ error: "token_required", code: "401" });
	}

	checkToken(token)
		.then((decoded) => {
			return next();
		})
		.catch((err) => {
			return res.status(401).json({ error: "token_not_valid", code: "401" });
		});
};

/**
 * Check if the given token is valid
 * @param {String} token
 * @returns the decoded token
 */
const checkToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) reject(err);
			else resolve(decoded);
		});
	});
};

module.exports = { verifyToken, checkToken };
