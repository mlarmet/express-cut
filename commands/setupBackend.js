const vscode = require("vscode");
const { folderExist, duplicateFolderRecursively, readFileContent } = require("../utils");

//======================================
const BACKEND_TEMPLATE_PATH = "/src/backend";

const BACKEND_FOLDER_NAME = "backend";

const PACKAGE_FILE_NAME = "package.json";
//======================================

const encoder = new TextEncoder();

async function setupBackend(context) {
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
	// Check if the backend folder exists
	//
	if (await folderExist(BACKEND_FOLDER_NAME)) {
		vscode.window.showErrorMessage("Le dossier " + BACKEND_FOLDER_NAME + " existe deja a la racine");
		return;
	}

	//
	// Get the name of the project
	//
	let project_name = await vscode.window.showInputBox({ prompt: "Nom du project" });
	if (project_name == "" || project_name == undefined) {
		vscode.window.showErrorMessage("Le nom du projet est invalide");
		return;
	}

	const PROJECT_NAME = project_name.toLowerCase().replace(" ", "-");

	//
	// Get the content of the description
	//
	let PROJECT_DESCRIPTION = await vscode.window.showInputBox({ prompt: "Description du projet" });

	const TARGET_PATH_URI = vscode.Uri.joinPath(workspaceFolders[0].uri, BACKEND_FOLDER_NAME);
	const SOURCE_PATH = context.extensionPath + BACKEND_TEMPLATE_PATH;

	const EXCLUDED_ELEMENTS = ["node_modules", ".git", ".vscode", "package-lock.json", "package.json"];

	//
	// Copy the backend folder
	//
	await duplicateFolderRecursively(SOURCE_PATH, TARGET_PATH_URI.fsPath, EXCLUDED_ELEMENTS);

	//
	// Copy the edited package.json file
	//
	let package_json_content_string = (await readFileContent(SOURCE_PATH + "/" + PACKAGE_FILE_NAME)).toString();

	package_json_content_string = package_json_content_string.replace("%%project-name%%", PROJECT_NAME);
	package_json_content_string = package_json_content_string.replace("%%project-description%%", PROJECT_DESCRIPTION);

	// String to Uint8Array
	const package_json_content = encoder.encode(package_json_content_string);

	// Add new content to liste route file
	const PACKAGE_FILE_URI = vscode.Uri.joinPath(TARGET_PATH_URI, PACKAGE_FILE_NAME);
	await vscode.workspace.fs.writeFile(PACKAGE_FILE_URI, package_json_content);

	//
	// END
	//
	vscode.window.showInformationMessage("Le projet " + PROJECT_NAME + " a ete copier avec succes");
}

module.exports = setupBackend;
