'use strict';

const path = require('path');
const EventEmitter = require('events');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const asyncQueue = require('./async-queue');

function copyFile(inputFilename, outputFilename) {
	return new Promise((resolve, reject) => {
		const output = fs.createWriteStream(outputFilename);
		output.on('error', reject);
		output.on('close', resolve);
		const input = fs.createReadStream(inputFilename);
		input.on('error', reject);
		input.pipe(output);
	});
}

class PluginManager extends EventEmitter {
	constructor({pluginDir, watch = false} = {}) {
		super();
		this._pluginDir = pluginDir;
		this._watch = watch;
		this._watcher = null;
		this._sources = new Set();
		this._awaitUpdates = asyncQueue();
	}

	add(source) {
		if (typeof source !== 'string') {
			throw new TypeError('plugin source must be a string.');
		}
		source = path.resolve(source);
		if (this._sources.add(source) && this._watch) {
			const watchTarget = path.dirname(source);
			if (this._watcher === null) {
				this._watcher = chokidar.watch(watchTarget, {
					ignoreInitial: true,
					disableGlobbing: true
				});
				this._watcher.on('error', err => this.emit('error', err));
				this._watcher.on('add', filename => this._changeDetected(filename));
				this._watcher.on('change', filename => this._changeDetected(filename));
			} else {
				this._watcher.add(watchTarget);
			}
		}
	}

	addAll(sources) {
		for (const source of sources) {
			this.add(source);
		}
	}

	update(source) {
		return this._awaitUpdates(async () => {
			await fs.ensureDir(this._pluginDir);
			await copyFile(source, path.join(this._pluginDir, path.basename(source)));
			this.emit('update');
		});
	}

	updateAll() {
		const self = this;
		return self._awaitUpdates(async () => {
			await fs.ensureDir(self._pluginDir);
			await Promise.all((function * () {
				for (const source of self._sources) {
					yield copyFile(source, path.join(self._pluginDir, path.basename(source)));
				}
			})());
			self.emit('update');
		});
	}

	async close() {
		if (this._watcher !== null) {
			this._watcher.close();
			this._watcher = null;
		}
		await this._awaitUpdates.complete();
	}

	_changeDetected(filename) {
		if (this._sources.has(filename)) {
			this.update(filename);
		}
	}
}

module.exports = PluginManager;
