const vscode = require("vscode");
const { folderExist, findFileInWorkspace, readFileContent } = require("../../../utils/files");
const { checkContext, checkWorkspace } = require("../../../utils/workspace");

const { capitalise } = require("../../../utils/string");

//======================================
const COMPONENT_TEMPLATE_PATH = "/src/template/react/component";

const COMPONENT_PARENT_FOLDER_NAME = "components";

//======================================

const encoder = new TextEncoder();

async function addComponent(context) {
	if (!checkContext(context)) {
		return;
	}

	if (!checkWorkspace()) {
		return;
	}

	const COMPONENT_PARENT_FOLDER_URI = await folderExist(COMPONENT_PARENT_FOLDER_NAME);
	//
	// Check if the parent components folder exists
	//
	if (COMPONENT_PARENT_FOLDER_URI == null) {
		vscode.window.showErrorMessage("Le dossier " + COMPONENT_PARENT_FOLDER_NAME + " n'existe pas !");
		return;
	}

	//
	// Get the name of the component
	//
	let raw_component_name = await vscode.window.showInputBox({ prompt: "Nom du composant" });
	if (raw_component_name == "" || raw_component_name == undefined) {
		vscode.window.showErrorMessage("Le nom du composant est invalide");
		return;
	}

	const COMPONENT_NAME = raw_component_name.toLowerCase().replace(" ", "-");

	const COMPONENT_FILE_NAME = COMPONENT_NAME + ".jsx";
	//
	// Check if the component exists
	//
	if (await findFileInWorkspace(COMPONENT_FILE_NAME, COMPONENT_PARENT_FOLDER_NAME + "/" + COMPONENT_NAME)) {
		vscode.window.showErrorMessage("Le composant " + COMPONENT_NAME + " existe deja !");
		return;
	}

	const SOURCE_PATH = context.extensionPath + COMPONENT_TEMPLATE_PATH;
	const TARGET_PATH_URI = vscode.Uri.joinPath(COMPONENT_PARENT_FOLDER_URI, COMPONENT_NAME);

	const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(SOURCE_PATH));

	//
	// Copy the component files
	//
	for (const file of files) {
		const src_file_name = file[0];

		// add file extension to the file name
		const fileName = `${COMPONENT_NAME}.${src_file_name.split(".")[1]}`;

		//
		// Get content of component file
		//
		let src_file_content_string = (await readFileContent(SOURCE_PATH + "/" + src_file_name)).toString();

		src_file_content_string = src_file_content_string.replaceAll("%%component_name%%", COMPONENT_NAME);
		src_file_content_string = src_file_content_string.replaceAll("%%component_name_cap%%", capitalise(COMPONENT_NAME));

		// String to Uint8Array
		const src_file_content = encoder.encode(src_file_content_string);

		await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(TARGET_PATH_URI, fileName), src_file_content);
	}

	//
	// END
	//
	vscode.window.showInformationMessage("Le composant " + COMPONENT_NAME + " a été créé avec succès");
}

module.exports = addComponent;
