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

	const file = await vscode.workspace.findFiles("**/" + path + "/" + fileName);
	return file.length > 0;
}

/**
 * Vérifie récursivement si un dossier existe dans les sous-dossiers.
 * @param {string} folderName Nom du dossier à rechercher
 * @param {string} [rootPath] Chemin du dossier racine à partir duquel commencer la recherche
 * @returns {Promise<vscode.Uri | undefined>} L'URI du dossier trouvé ou undefined si aucun dossier n'a été trouvé
 */
async function folderExist(folderName, rootPath = undefined) {
	if (!workspaceFolders) return undefined;

	rootPath = rootPath || vscode.workspace.workspaceFolders[0].uri.fsPath;

	const dir = await vscode.workspace.fs.readDirectory(vscode.Uri.file(rootPath));

	for (let i = 0; i < dir.length; i++) {
		const [fileName, fileType] = dir[i];
		const fullPath = `${rootPath}/${fileName}`;

		if (fileType !== vscode.FileType.Directory) {
			continue;
		}

		if (fileName === "node_modules") {
			continue;
		}

		if (fileName === folderName) {
			return vscode.Uri.file(fullPath);
		}

		const nestedFolderUri = await folderExist(folderName, fullPath);

		if (nestedFolderUri) {
			return nestedFolderUri;
		}
	}

	return undefined;
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
	await vscode.workspace.fs.createDirectory(vscode.Uri.file(targetPath));

	// Read source directory
	const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(sourcePath));

	// Iterate over files and directories
	for (const file of files) {
		const [fileName, fileType] = file;

		const sourceFilePath = path.join(sourcePath, fileName);
		const targetFilePath = path.join(targetPath, fileName);

		if (excluded_elements.includes(file)) {
			continue;
		}

		if (fileType === vscode.FileType.Directory) {
			// Recursively duplicate subdirectory
			await duplicateFolderRecursively(sourceFilePath, targetFilePath);
		} else {
			// Duplicate file
			await vscode.workspace.fs.copy(vscode.Uri.file(sourceFilePath), vscode.Uri.file(targetFilePath));
		}
	}
}

/**
 * Obtenir l'URI d'un fichier.
 * Possibilité de spécifier le dossier parent.
 * @example findFileInWorkspace("route.js", "routes")
 * @param {string} fileName Nom du fichier à rechercher
 * @param {string=} parentFolder Nom du dossier parent du fichier à rechercher
 * @returns L'URI du fichier trouvé ou undefined si aucun fichier n'a été trouvé
 */
async function findFileInWorkspace(fileName, parentFolder = undefined) {
	const searchPattern = parentFolder ? `**/${parentFolder}/${fileName}` : `**/${fileName}`;
	const files = await vscode.workspace.findFiles(searchPattern);

	if (files.length > 0) {
		// Le dossier a été trouvé, retournez son URI parent
		return vscode.Uri.file(files[0].fsPath);
	}

	// Fichier non trouvé
	return undefined;
}

/**
 * Lis un fichier de l'extension et retourne son contenu.
 * @example readFileContent("route.js")
 * @param {string} fullPath Chemin du fichier à lire + nom du fichier
 * @returns {Promise<Uint8Array>} Chaine de caractères du contenu du fichier, undefined si le fichier n'existe pas
 */
async function readFileContent(fullPath) {
	const FILE_URI = vscode.Uri.file(fullPath);

	try {
		return await vscode.workspace.fs.readFile(FILE_URI);
		// const file_content_string = file_content.toString();
	} catch (error) {
		return undefined;
	}
}

module.exports = {
	findFileInWorkspace,
	folderExist,
	duplicateFolderRecursively,
	readFileContent,
};
