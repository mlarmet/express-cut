const vscode = require("vscode");
const { readFileContent } = require("../utils");

//======================================
const ROUTE_TEMPLATE_PATH = "/src/route";

//======================================

const encoder = new TextEncoder();

async function addRoute(context) {
	if (!context) {
		vscode.window.showErrorMessage("Le contexte est invalide");
		return;
	}

	// The code you place here will be executed every time your command is executed
	const workspaceFolders = vscode.workspace.workspaceFolders;

	//
	// Check if a workspace is open
	//
	if (!workspaceFolders) {
		vscode.window.showErrorMessage("Aucun dossier ouvert dans l'espace de travail");
		return;
	}

	//
	// Get active route file opened
	//
	const ACTIVE_TEXT_EDITOR = vscode.window.activeTextEditor;
	if (!ACTIVE_TEXT_EDITOR) {
		vscode.window.showErrorMessage("Aucun fichier ouvert");
		return;
	}

	const TYPE_ROUTE = await vscode.window.showQuickPick(["GET", "POST", "PUT", "DELETE"], {
		placeHolder: "Sélectionner le type de route",
	});

	if (TYPE_ROUTE == undefined) {
		vscode.window.showErrorMessage("Aucun type de route sélectionné");
		return;
	}

	//
	// Get content of type route template file
	//
	let type_file_content = await readFileContent(context.extensionPath + ROUTE_TEMPLATE_PATH + "/" + TYPE_ROUTE + ".js");
	if (type_file_content == null) {
		vscode.window.showErrorMessage("Erreur lors de la lecture du fichier " + TYPE_ROUTE);
		return;
	}

	//
	// Ask for type route path if GET and POST (other types have '/:id' by default)
	//
	if (TYPE_ROUTE !== "PUT" && TYPE_ROUTE !== "DELETE") {
		//
		// Get type route path
		//
		let type_route_path = await vscode.window.showInputBox({ prompt: "Chemin de la route (par défaut : '/')" });

		if (type_route_path[0] === "/") {
			type_route_path = type_route_path.substring(1);
		}

		//
		// Add type route path to type route template file if provided
		//
		if (type_route_path !== "") {
			let type_file_content_string = type_file_content.toString();
			type_file_content_string = type_file_content_string.replace(`.${TYPE_ROUTE.toLowerCase()}("/`, `.${TYPE_ROUTE.toLowerCase()}("/${type_route_path}`);
			type_file_content = encoder.encode(type_file_content_string);
		}
	}

	await ACTIVE_TEXT_EDITOR.edit((editBuilder) => {
		editBuilder.insert(ACTIVE_TEXT_EDITOR.selection.active, type_file_content.toString());
	});

	vscode.window.showInformationMessage("Type route " + TYPE_ROUTE + " ajouté au fichier " + ACTIVE_TEXT_EDITOR.document.fileName.split("\\").pop() || "");
}

module.exports = addRoute;
