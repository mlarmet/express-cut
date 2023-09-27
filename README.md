# VS Code Extension Readme

This VS Code extension allows you to quickly set up an ExpressJS project.

## Requirements

-   VS Code version 1.60.0 or higher
-   This extension requires that you have an Express.js project open in Visual Studio Code, with a "routes" folder and a `routes.js` file in that folder. If these files don't exist, you will need to create them manually before using this extension.

## Usage

### Setup new backend project

1. Open the VS Code Command Palette by pressing `Ctrl+Shift+P`

2. Type `Create new nodejs backend project` and press `Enter`

The extension will create a new `backend` folder with all necessary to start ExpressJS project. After run `npm install`, the created project is directly runnable.

### Create new file route

1. Open the VS Code Command Palette by pressing `Ctrl+Shift+P`

2. Type `Create new route` and press `Enter`

3. Enter the name of the new route when prompted

4. Enter the name of the table associated with the route when prompted

The extension will create a new route file in the `routes` folder of your project, along with an entry in the `routes.js` file.

### Add new route to exist file

1. Write `r` + the type of the route : `get`, `post`, `put`, `del`
   e.g. : `rget`

2. Press `ctrl` + `space` and choose the `typeRoot***` completion

3. Press `enter`

The route will be added in the opened files at the cursor position.

## License

This extension is licensed under the MIT License. See the `LICENSE` file for more information.
