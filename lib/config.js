'use strict';

const path = require('path');
const fs = require('fs-extra');
const defaults = require('lodash.defaultsdeep');

function getFilename(basedir) {
	return path.join(basedir, 'autospigot.json');
}

async function write(basedir, data) {
	const filename = getFilename(basedir);
	await fs.ensureDir(path.dirname(filename));
	await fs.writeJson(filename, data, {spaces: '\t'});
}

async function load(basedir) {
	const config = defaults(await fs.readJson(getFilename(basedir)), {
		data: 'data',
		executable: 'spigot.jar',
		plugins: [],
		javaArgs: [],
		serverArgs: []
	});
	config.data = path.resolve(basedir, config.data);
	config.executable = path.resolve(basedir, config.executable);
	config.plugins = config.plugins.map(source => path.resolve(basedir, source));
	return config;
}

async function prepare(config) {
	await fs.ensureDir(config.data);
	await fs.ensureDir(path.join(config.data, 'plugins'));
	await fs.writeFile(path.join(config.data, 'eula.txt'), 'eula=true\n', 'utf8');
}

module.exports = {write, load, prepare};
