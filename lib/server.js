'use strict';

const EventEmitter = require('events');
const cp = require('child_process');

class Server extends EventEmitter {
	constructor(config, io) {
		super();
		this._closed = false;
		this._proc = cp.spawn('java', [
			...config.javaArgs,
			'-jar', config.executable,
			...config.serverArgs
		], {
			cwd: config.data,
			stdio: [
				null,
				(io && io.stdout) || process.stdout,
				(io && io.stderr) || process.stderr
			],
			shell: false
		});
		this._proc.once('exit', () => this._cleanup());
		this.closed = new Promise(resolve => this.once('close', resolve));
	}

	command(line) {
		if (!this._closed) {
			this._proc.stdin.write(line + '\n');
		}
	}

	reload() {
		this.command('reload');
	}

	close() {
		this.command('stop');
	}

	kill() {
		if (!this._closed) {
			this._proc.kill();
		}
	}

	_cleanup() {
		if (this._closed ? false : (this._closed = true)) {
			this.emit('close');
		}
	}
}

module.exports = Server;
