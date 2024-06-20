const capitalise = (str) => {
	if (str == null) {
		return null;
	}

	return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Transforme une chaine en PascalCase
 * @example pascalCase("hello world") => "HelloWorld"
 * @example pascalCase("hello-world") => "HelloWorld"
 * @param {*} str Chaine à transformer en PascalCase
 * @returns La chaine en PascalCase
 */
const pascalCase = (str) => {
	if (str == null) {
		return null;
	}

	str = str.replaceAll(" ", "-");

	return str
		.split("-")
		.map((word) => capitalise(word))
		.join("");
};

module.exports = {
	capitalise,
	pascalCase,
};
