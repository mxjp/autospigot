'use strict';

const EventEmitter = require('events');
const rl = require('readline');

class ServerInput extends EventEmitter {
	constructor(io) {
		super();
		this._terminal = rl.createInterface({
			input: (io && io.input) || process.stdin,
			output: (io && io.output) || process.stdout,
			prompt: ''
		});
		this._terminal.on('line', line => {
			if (this.server !== null) {
				this.server.command(line);
			}
			this.emit('command', line);
		});
		this._abortHandler = () => {
			this.server.command('stop');
			this.emit('abort');
		};
		process.on('SIGINT', this._abortHandler);
	}

	close() {
		this._terminal.close();
		process.removeListener('SIGINT', this._abortHandler);
	}
}

module.exports = ServerInput;
