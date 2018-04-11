/* eslint-disable no-await-in-loop */
/* eslint-disable no-unmodified-loop-condition */
'use strict';

const path = require('path');
const parse = require('command-line-args');
const lib = require('..');

async function start(argv) {
	const args = parse([
		{name: 'server', alias: 's'},
		{name: 'keep-alive', alias: 'r', type: Boolean},
		{name: 'no-watch', alias: 'n', type: Boolean}
	], {argv});
	const basedir = path.resolve(args.server || '.');
	const config = await lib.config.load(basedir);
	await lib.config.prepare(config);

	let server = null;

	const plugins = new lib.PluginManager({
		pluginDir: path.join(config.data, 'plugins'),
		watch: !args['no-watch']
	});
	plugins.addAll(config.plugins);
	await plugins.updateAll();
	plugins.on('update', () => {
		if (server !== null) {
			server.reload();
		}
	});

	let keepAlive = true;
	const input = new lib.ServerInput();
	input.on('command', line => {
		if (line === 'stop') {
			keepAlive = false;
		}
	});
	input.on('abort', () => {
		keepAlive = false;
	});

	do {
		server = new lib.Server(config);
		input.server = server;
		await server.closed;
	} while (keepAlive);
	input.close();
	await plugins.close();
}

module.exports = start;
