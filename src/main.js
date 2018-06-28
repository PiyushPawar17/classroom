const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1430,
		height: 800,
		resizable: false,
		title: 'Classroom'
	});
	const startUrl = process.env.DEV_URL ||
		url.format({
		pathname: path.join(__dirname, '/../build/index.html'),
		protocol: 'file:',
		slashes: true
	});
	mainWindow.setMenu(null);
	mainWindow.loadURL(startUrl);
	mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);
