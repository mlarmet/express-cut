// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

const setupBackend = require("./commands/setupBackend");
const createRoute = require("./commands/createRoute");
const addTypeRoute = require("./commands/add");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let createCommand = vscode.commands.registerCommand("route.createNewRoute", () => createRoute(context));
	context.subscriptions.push(createCommand);

	let setupBackendCommand = vscode.commands.registerCommand("backend.setupProject", () => setupBackend(context));
	context.subscriptions.push(setupBackendCommand);

	let addCommand = vscode.commands.registerCommand("route.addTypeRoute", () => addTypeRoute(context));
	context.subscriptions.push(addCommand);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};

/*async function updateSnippetsBody(context) {
	let snippetsUri = vscode.Uri.file("./snippets.json");
	let snippets = await readFileContent(context.extensionPath + "/snippets.json");

	console.log(snippetsObject);

	//
	// Read all route type template files and add content to snippets
	//
	for (let type of ["GET", "POST", "PUT", "DELETE"]) {
		//get content of route type template file
		let type_file_content = await readFileContent(context.extensionPath + ROUTE_TEMPLATE_PATH + "/" + type + ".js");

		if (type_file_content == null) {
			// vscode.window.showErrorMessage("Erreur lors de la lecture du fichier " + type);
			return;
		}

		let typeCamelCase = type.toLowerCase().charAt(0).toUpperCase() + type.toLowerCase().slice(1);

		snippetsObject["typeRoute" + typeCamelCase].body = new vscode.SnippetString(type_file_content.toString()).value;
	}

	console.log(snippetsObject);

	//
	// Write new snippets content
	//
	//await vscode.workspace.fs.writeFile(snippetsUri, new TextEncoder().encode(JSON.stringify(snippetsObject)));
}*/
