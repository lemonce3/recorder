const { app } = require('electron');
const fs = require('fs');
const path = require('path');
// const configPath = path.resolve(app.getPath());
const configPath = path.resolve(process.cwd(), 'config.json');

const DEFAULT_CONFIG = {
	recentList: []
};

if (!fs.existsSync(configPath)) {
	fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG));
}

export const config = JSON.parse(fs.readFileSync(configPath));

export function syncConfig() {
	fs.promises.writeFile(configPath, JSON.stringify(config));
}