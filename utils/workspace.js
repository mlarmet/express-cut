const vscode = require("vscode");

async function checkContext(context) {
	if (!context) {
		vscode.window.showErrorMessage("Le contexte est invalide");
		return false;
	}

	return true;
}

async function checkWorkspace() {
	//
	// Check if a workspace is open
	//
	if (!vscode.workspace.workspaceFolders) {
		vscode.window.showErrorMessage("Aucun dossier ouvert dans l'espace de travail");
		return false;
	}

	return true;
}

module.exports = {
	checkContext,
	checkWorkspace,
};
