function capitalise(str) {
	if (str == null) {
		return null;
	}

	return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
	capitalise,
};
