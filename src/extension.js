// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

const setupBackend = require("./commands/expressjs/setupBackend");
const createRoute = require("./commands/expressjs/createRoute");
// const addTypeRoute = require("./commands/expressjs/addRoute");

const addComponent = require("./commands/react/addComponent");

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

	const commands = [
		{ commandName: "express.setupProject", functionName: setupBackend },
		{ commandName: "route.createNewRoute", functionName: createRoute },
		//{ commandName: "route.addTypeRoute", functionName: addTypeRoute },
		{ commandName: "react.addComponent", functionName: addComponent, args: ["components"] },
		{ commandName: "react.addView", functionName: addComponent, args: ["views"] },
	];

	commands.forEach((command) => {
		const commandRegistration = vscode.commands.registerCommand(command.commandName, () => {
			command.functionName(context, ...(command.args ? [command.args] : []));
		});
		context.subscriptions.push(commandRegistration);
	});
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
