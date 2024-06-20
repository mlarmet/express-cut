const transformSingleQuote = (str) => str.toString().replace(/'/g, "''");

const removeBreakLines = (str) => str.toString().replace(/[\r\n]/g, "");

const insertString = (str, index, value) => str.substr(0, index) + value + str.substr(index);

const replaceAll = (str, find, replace) => str.replace(new RegExp(find, "g"), replace);

const pluriel = (string, integer) => (integer > 1 ? string + "s" : string);

module.exports = { transformSingleQuote, removeBreakLines, insertString, replaceAll, pluriel };
