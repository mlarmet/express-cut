const vscode = require("vscode");
const { findFileInWorkspace, readFileContent } = require("../../../utils/files");
const { checkContext, checkWorkspace } = require("../../../utils/workspace");

//======================================
const ROUTE_TEMPLATE_PATH = "/src/template/route";

const ROUTE_FOLDER_NAME = "routes";
const ROUTE_LIST_NAME = "routes.js";

const HEADER_FILE_NAME = "header.js";
const FOOTER_FILE_NAME = "footer.js";
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
	if (ROUTE_LIST_URI == null) {
		vscode.window.showErrorMessage("Le fichier " + ROUTE_LIST_NAME + " n'existe pas !");
		return;
	}

	const ROUTE_FOLDER_PATH = ROUTE_LIST_URI.fsPath.replace(ROUTE_LIST_NAME, "");

	//
	// Get the name of the new route
	//
	const ROUTE_NAME = await vscode.window.showInputBox({ prompt: "Nom de la route" });
	if (ROUTE_NAME == "" || ROUTE_NAME == undefined) {
		vscode.window.showErrorMessage("Le nom de la route est invalide");
		return;
	}

	const ROUTE_FILE = ROUTE_NAME + ".js";
	//
	// Check if the route already exists
	//
	if ((await findFileInWorkspace(ROUTE_FILE, ROUTE_FOLDER_NAME)) != null) {
		vscode.window.showErrorMessage("La route " + ROUTE_FILE + " existe déjà dans " + ROUTE_FOLDER_NAME);
		return;
	}

	//
	// Get URI of new route file
	//
	const ROUTE_URI = vscode.Uri.file(ROUTE_FOLDER_PATH + "/" + ROUTE_FILE);

	//
	// Get content of route.js
	//
	let route_liste_content_string = (await readFileContent(ROUTE_LIST_URI.fsPath)).toString();

	const containsRoute = new RegExp(`path: "${ROUTE_NAME}"`).test(route_liste_content_string);

	if (containsRoute) {
		vscode.window.showErrorMessage("La route " + ROUTE_FILE + " existe déjà dans " + ROUTE_LIST_NAME);
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

	const TYPES_ROUTES = await vscode.window.showQuickPick(["GET", "POST", "PUT", "DELETE"], {
		canPickMany: true,
		placeHolder: "Sélectionner les types de route",
	});

	if (TYPES_ROUTES.length == 0) {
		vscode.window.showErrorMessage("Aucun type de route sélectionné");
		return;
	}

	//
	// Get content of header template file
	//
	let header_content = await readFileContent(context.extensionPath + ROUTE_TEMPLATE_PATH + "/" + HEADER_FILE_NAME);
	if (header_content == null) {
		vscode.window.showErrorMessage("Erreur lors de la lecture du fichier " + HEADER_FILE_NAME);
		return;
	}

	let header_content_string = header_content.toString();

	header_content_string = header_content_string.replace(/%%route_name%%/g, ROUTE_NAME);
	header_content_string = header_content_string.replace(/%%table_name%%/g, TABLE_NAME);

	header_content = encoder.encode(header_content_string);

	//
	// Write header content to new route file
	//
	let total_file_content = header_content;

	//
	// Get content of each type route template file
	//
	for (let type of TYPES_ROUTES) {
		//get content of route type template file
		let type_file_content = await readFileContent(context.extensionPath + ROUTE_TEMPLATE_PATH + "/" + type + ".js");
		if (type_file_content == null) {
			vscode.window.showErrorMessage("Erreur lors de la lecture du fichier " + type);
			return;
		}

		//add content of route type template file to new route file
		total_file_content = Buffer.concat([total_file_content, type_file_content]);
	}

	//
	// Get content of footer template file
	//
	let footer_content = await readFileContent(context.extensionPath + ROUTE_TEMPLATE_PATH + "/" + FOOTER_FILE_NAME);
	if (footer_content == null) {
		vscode.window.showErrorMessage("Erreur lors de la lecture du fichier " + FOOTER_FILE_NAME);
		return;
	}

	//
	// Add footer content to new route file
	//
	total_file_content = Buffer.concat([total_file_content, footer_content]);

	await vscode.workspace.fs.writeFile(ROUTE_URI, total_file_content);

	//============= ADD ROUTE PATH TO ROUTE LIST FILE =============

	const new_route = `{ path: "${ROUTE_NAME}", router: "${ROUTE_NAME}" }`;

	//
	// Find closing bracket and eventual comma with break lines or tabs
	//

	const listNotEmpty = /}(.*\s*)*];?/.test(route_liste_content_string);

	console.log(listNotEmpty);

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
	route_liste_content_string = route_liste_content_string.replace(regex, `${start}\r\n\t${new_route},\r\n];`);

	//string to Uint8Array
	const route_liste_content = encoder.encode(route_liste_content_string);
	//add new content to liste route file
	await vscode.workspace.fs.writeFile(ROUTE_LIST_URI, route_liste_content);

	vscode.window.showInformationMessage("Route " + ROUTE_FILE + " créé avec succès");
}

module.exports = createRoute;
