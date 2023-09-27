const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const workspaceFolders = vscode.workspace.workspaceFolders;

/**
 * Vérifie si un fichier existe.
 * @param {string} path Dossier parent du fichier à rechercher
 * @param {string} fileName Nom du fichier à rechercher
 * @returns {Promise<Boolean>} true si le fichier existe, false sinon
 */
async function fileExist(path, fileName) {
	if (!workspaceFolders) return false;
	console.log("**/" + path + "/" + fileName);
	let file = await vscode.workspace.findFiles("**/" + path + "/" + fileName);
	return file.length > 0;
}

/**
 * Vérifie si un dossier existe.
 * @param {string} folderName Nom du dossier à rechercher
 * @returns {Promise<Boolean>} true si le fichier existe, false sinon
 */
async function folderExist(folderName) {
	if (!workspaceFolders) return false;

	const rootPath = workspaceFolders[0].uri.fsPath;

	let dir = await vscode.workspace.fs.readDirectory(vscode.Uri.file(rootPath));

	for (let i = 0; i < dir.length; i++) {
		const [name, type] = dir[i];
		if (type === vscode.FileType.Directory) {
			if (name == folderName) {
				console.log(dir[i]);
				return true;
			}
		}
	}

	return false;
}

function getFolderPath(folderName) {
	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (!workspaceFolders) return null;

	for (let folder of workspaceFolders) {
		let folderPath = folder.uri.fsPath;
		let files = fs.readdirSync(folderPath);

		if (files.includes(folderName)) {
			return vscode.Uri.joinPath(folder.uri, folderName).fsPath;
		}
	}

	return null;
}

/**
 * Duplique un dossier et son contenu de manière récursive.
 * @example duplicateFolderRecursively("src/backend", workspace + "/backend")
 * @param {string} sourcePath Chemin du dossier à dupliquer
 * @param {string} targetPath Chemin où le dossier sera dupliqué
 * @param {string[]} excluded_elements Lister de dossiers et de fichiers a ne pas dupliquer
 */
async function duplicateFolderRecursively(sourcePath, targetPath, excluded_elements = []) {
	// Create target directory
	fs.mkdirSync(targetPath);

	// Read source directory
	const files = fs.readdirSync(sourcePath);

	// Iterate over files and directories
	for (const file of files) {
		const sourceFilePath = path.join(sourcePath, file);
		const targetFilePath = path.join(targetPath, file);

		if (excluded_elements.includes(file)) {
			continue;
		}

		// Check if it's a file or directory
		const isDirectory = fs.lstatSync(sourceFilePath).isDirectory();

		if (isDirectory) {
			// Recursively duplicate subdirectory
			await duplicateFolderRecursively(sourceFilePath, targetFilePath);
		} else {
			// Duplicate file
			fs.copyFileSync(sourceFilePath, targetFilePath);
		}
	}
}

/**
 * Obtenir l'URI d'un fichier.
 * Possibilité de spécifier le dossier parent.
 * @example findFileInWorkspace("route.js", "routes")
 * @param {string} fileName Nom du fichier à rechercher
 * @param {string=} parentFolder Nom du dossier parent du fichier à rechercher
 * @returns L'URI du fichier trouvé ou null si aucun fichier n'a été trouvé
 */
async function findFileInWorkspace(fileName, parentFolder = null) {
	const searchPattern = parentFolder ? `**/${parentFolder}/${fileName}` : `**/${fileName}`;
	const files = await vscode.workspace.findFiles(searchPattern);

	if (files.length > 0) {
		// Le dossier a été trouvé, retournez son URI parent
		return vscode.Uri.file(files[0].fsPath);
	}

	// Fichier non trouvé
	return null;
}

/**
 * Lis un fichier de l'extension et retourne son contenu.
 * @example readFileContent("route.js")
 * @param {string} fullPath Chemin du fichier à lire + nom du fichier
 * @returns {Promise<Uint8Array>} Chaine de caractères du contenu du fichier, null si le fichier n'existe pas
 */
async function readFileContent(fullPath) {
	const FILE_URI = vscode.Uri.file(fullPath);

	try {
		return await vscode.workspace.fs.readFile(FILE_URI);
		// const file_content_string = file_content.toString();
	} catch (error) {
		return null;
	}
}

module.exports = { findFileInWorkspace, readFileContent, folderExist, duplicateFolderRecursively };
