#!/usr/bin/env node
'use strict';

const path = require('path');
const EventEmitter = require('events');
const cp = require('child_process');
const readline = require('readline');
const parse = require('command-line-args');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const defaults = require('lodash.defaultsdeep');
const help = require('./help');
const {formatPath} = require('./utility');

async function run() {
	const command = parse([
		{name: 'run', defaultOption: true}
	], {stopAtFirstUnknown: true});
	const argv = command._unknown || [];

	if (command.run === 'init') {
		const args = parse([{name: 'target', defaultOption: true}], {argv});
		const target = args.target ? path.resolve(args.target) : process.cwd();

		const configFilename = path.join(target, 'autospigot.json');
		const config = {
			executable: 'spigot.jar',
			workingDirectory: 'server',
			pluginSources: [],
			javaArgs: [],
			serverArgs: []
		};
		console.info('Writing config to', formatPath(configFilename));
		await fs.ensureDir(path.dirname(configFilename));
		await fs.writeJson(path.join(target, 'autospigot.json'), config, {spaces: '\t'});
	} else if (command.run === 'start') {
		const args = parse([{name: 'target', defaultOption: true}], {argv});
		const target = args.target ? path.resolve(args.target) : process.cwd();
		const config = defaults(await fs.readJson(path.join(target, 'autospigot.json')), {
			executable: 'spigot.jar',
			workingDirectory: 'server',
			pluginSources: [],
			javaArgs: [],
			serverArgs: []
		});
		const executable = path.resolve(target, config.executable);
		const events = new EventEmitter();

		const workingDir = path.resolve(target, config.workingDirectory);
		await fs.ensureDir(workingDir);

		const pluginDir = path.join(workingDir, 'plugins');
		await fs.ensureDir(pluginDir);
		function updatePlugin(source) {
			return new Promise((resolve, reject) => {
				const input = fs.createReadStream(source);
				const output = fs.createWriteStream(path.join(pluginDir, path.basename(source)));
				output.on('error', reject);
				output.on('close', resolve);
				input.on('error', reject);
				input.pipe(output);
			});
		}

		const updateTasks = [];
		const pluginSources = config.pluginSources.map(source => path.resolve(target, source));
		for (const source of pluginSources) {
			updateTasks.push(updatePlugin(source));
		}
		await Promise.all(updateTasks);

		const eulaFilename = path.join(workingDir, 'eula.txt');
		if (!await fs.pathExists(eulaFilename)) {
			await fs.writeFile(eulaFilename, 'eula=true\n', 'utf8');
		}

		const serverArgs = [...config.javaArgs, '-jar', executable, ...config.serverArgs];
		console.log(`Starting server with 'java ${serverArgs.join(' ')}'`);
		const server = cp.spawn('java', serverArgs, {
			cwd: workingDir,
			stdio: [null, process.stdout, process.stderr],
			shell: false
		});
		process.on('SIGINT', () => {
			server.stdin.write('stop\n');
		});

		const terminal = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			prompt: ''
		});
		terminal.on('line', line => {
			if (!serverExited) {
				server.stdin.write(line + '\n');
			}
		});

		let watcher = null;
		let watcherEvent = false;
		function watchPluginSource(source) {
			if (watcher === null) {
				watcher = chokidar.watch(source);
				watcher.on('error', console.error);
				watcher.on('change', filename => {
					console.log('Plugin changed:', filename);
					if (!watcherEvent) {
						watcherEvent = true;
						setTimeout(() => {
							updatePlugin(filename).then(() => {
								server.stdin.write('reload\n');
								watcherEvent = false;
							}, err => {
								console.error(err);
								watcherEvent = false;
							});
						}, 750);
					}
				});
			} else {
				watcher.add(source);
			}
		}

		for (const source of pluginSources) {
			watchPluginSource(source);
		}

		await new Promise(r => server.once('exit', r));
		watcher.close();
		terminal.close();
	} else if (command.run === 'version') {
		const packageInfo = require('../package.json');
		console.info(`${packageInfo.name} v${packageInfo.version} (${packageInfo.license} Licensed)`);
	} else {
		if (command.run) {
			console.error('Unknown command:', command.run);
		}
		console.info(help);
		process.exit(2);
	}
}

exitOnError(run());

function exitOnError(promise) {
	return promise.catch(err => {
		console.error(err);
		process.exit(1);
	});
}
