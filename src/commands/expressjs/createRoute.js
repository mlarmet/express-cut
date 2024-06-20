const vscode = require("vscode");
const { findFileInWorkspace, folderExist, readFileContent } = require("../../../utils/files");
const { checkContext, checkWorkspace } = require("../../../utils/workspace");

const { capitalise } = require("../../../utils/strings");

//======================================
const ROUTE_TEMPLATE_PATH = "/src/template/route";

const ROUTE_LIST_NAME = "routes.js";

const DATA_FOLDER_NAME = "data";
const DATA_TEMPLATE_FILE = "data.js";

const ROUTE_FOLDER_NAME = "routes";
const ROUTE_TEMPLATE_FILE = "route.js";
//======================================

const encoder = new TextEncoder();

async function createRoute(context) {
	if (!checkContext(context)) {
		return;
	}

	if (!checkWorkspace()) {
		return;
	}

	const ROUTE_LIST_URI = await findFileInWorkspace(ROUTE_LIST_NAME, ROUTE_FOLDER_NAME);
	//
	// Check if the route.js file exists
	//
	if (ROUTE_LIST_URI == undefined) {
		vscode.window.showErrorMessage("Le fichier " + ROUTE_LIST_NAME + " n'existe pas !");
		return;
	}

	//
	// Get the name of the new route
	//
	const ROUTE_NAME = await vscode.window.showInputBox({ prompt: "Nom de la route" });
	if (ROUTE_NAME == "" || ROUTE_NAME == undefined) {
		vscode.window.showErrorMessage("Le nom de la route est invalide");
		return;
	}

	const ROUTE_FILE = ROUTE_NAME + ".route.js";
	//
	// Check if the route already exists
	//
	if ((await findFileInWorkspace(ROUTE_FILE, ROUTE_FOLDER_NAME)) != undefined) {
		vscode.window.showErrorMessage("La route `" + ROUTE_NAME + "` existe déjà dans " + ROUTE_FOLDER_NAME + " !");
		return;
	}

	const DATA_FILE = ROUTE_NAME + ".js";
	//
	// Check if the data already exists
	//
	if ((await findFileInWorkspace(DATA_FILE, DATA_FOLDER_NAME)) != undefined) {
		vscode.window.showErrorMessage("Le fichier data `" + DATA_FILE + "` existe déjà dans " + DATA_FOLDER_NAME + " !");
		return;
	}

	//
	// Get content of route.js
	//
	let route_liste_content_string = (await readFileContent(ROUTE_LIST_URI.fsPath)).toString();

	const containsRoute = new RegExp(`path: "${ROUTE_NAME}"`).test(route_liste_content_string);

	if (containsRoute) {
		vscode.window.showErrorMessage("La route `" + ROUTE_FILE + "` existe déjà dans " + ROUTE_LIST_NAME + " !");
		return;
	}

	//
	// Get the name of the table of the new route
	//
	const TABLE_NAME = await vscode.window.showInputBox({ prompt: "Nom de la table" });
	if (TABLE_NAME == "" || TABLE_NAME == undefined) {
		vscode.window.showErrorMessage("Le nom de la table est invalide");
		return;
	}

	//============= ADD NEW DATA TO DATA FOLDER =============

	//
	// Get content of data template file
	//
	let data_content = await readFileContent(context.extensionPath + ROUTE_TEMPLATE_PATH + "/" + DATA_TEMPLATE_FILE);
	if (data_content == undefined) {
		vscode.window.showErrorMessage("Erreur lors de la lecture du fichier `" + DATA_TEMPLATE_FILE + "`");
		return;
	}

	let data_content_string = data_content.toString();

	data_content_string = data_content_string.replaceAll("%%route_name_cap%%", capitalise(ROUTE_NAME));
	data_content_string = data_content_string.replaceAll("%%route_name%%", ROUTE_NAME.toLowerCase());
	data_content_string = data_content_string.replaceAll("%%table_name%%", TABLE_NAME);

	data_content = encoder.encode(data_content_string);

	//
	// Get URI of new data file
	//
	const DATA_FOLDER_PATH = await folderExist(DATA_FOLDER_NAME);

	if (DATA_FOLDER_PATH == undefined) {
		vscode.window.showErrorMessage("Le dossier `" + DATA_FOLDER_NAME + "` n'existe pas !");
		return;
	}

	const DATA_URI = vscode.Uri.file(DATA_FOLDER_PATH.fsPath + "/" + DATA_FILE);

	await vscode.workspace.fs.writeFile(DATA_URI, data_content);

	//============= ADD NEW ROUTE TO ROUTE FOLDER =============

	//
	// Get content of route template file
	//
	let route_content = await readFileContent(context.extensionPath + ROUTE_TEMPLATE_PATH + "/" + ROUTE_TEMPLATE_FILE);
	if (route_content == undefined) {
		vscode.window.showErrorMessage("Erreur lors de la lecture du fichier `" + ROUTE_TEMPLATE_FILE + "`");
		return;
	}

	let route_content_string = route_content.toString();

	route_content_string = route_content_string.replaceAll("%%route_name_cap%%", capitalise(ROUTE_NAME));
	route_content_string = route_content_string.replaceAll("%%route_name%%", ROUTE_NAME.toLowerCase());
	route_content_string = route_content_string.replaceAll("%%table_name%%", TABLE_NAME);

	route_content = encoder.encode(route_content_string);

	//
	// Get URI of new route file
	//
	const ROUTE_FOLDER_PATH = await folderExist(ROUTE_FOLDER_NAME);

	if (ROUTE_FOLDER_PATH == undefined) {
		vscode.window.showErrorMessage("Le dossier `" + ROUTE_FOLDER_NAME + "` n'existe pas !");
		return;
	}

	const ROUTE_URI = vscode.Uri.file(ROUTE_FOLDER_PATH.fsPath + "/" + ROUTE_FILE);

	await vscode.workspace.fs.writeFile(ROUTE_URI, route_content);

	//============= ADD ROUTE PATH TO ROUTE LIST FILE =============

	const NEW_ROUTE = `{ path: "${ROUTE_NAME}", router: "${ROUTE_NAME}.route" }`;

	//
	// Find closing bracket and eventual comma with break lines or tabs
	//

	const listNotEmpty = /}(.*\s*)*];?/.test(route_liste_content_string);

	let start = "";
	let regex = /(\s*)*];?/;

	if (listNotEmpty) {
		start = ",";

		const endWithComma = /(\s*)*,(\s*)*];?/.test(route_liste_content_string);
		if (endWithComma) {
			regex = /(\s*)*,(\s*)*];?/;
		}
	}

	//add break line before new route
	//add tab and new route
	//add break line after new route
	//re-add closing bracket
	route_liste_content_string = route_liste_content_string.replace(regex, `${start}\r\n\t${NEW_ROUTE},\r\n];`);

	//string to Uint8Array
	const route_liste_content = encoder.encode(route_liste_content_string);
	//add new content to liste route file
	await vscode.workspace.fs.writeFile(ROUTE_LIST_URI, route_liste_content);

	vscode.window.showInformationMessage("Route `" + ROUTE_FILE + "` créé avec succès");
}

module.exports = createRoute;
