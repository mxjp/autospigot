/* eslint-disable no-await-in-loop */
'use strict';

const EventEmitter = require('events');

function create() {
	const left = [];
	const events = new EventEmitter();
	let running = false;

	async function run() {
		running = true;
		while (left.length > 0) {
			const [entry, callback] = left.shift();
			const promise = entry();
			callback(promise);
			await promise.catch(() => {});
		}
		events.emit('complete');
		running = false;
	}

	function enqueue(entry) {
		return new Promise((resolve, reject) => {
			left.push([entry, promise => {
				promise.then(resolve, reject);
			}]);
			if (!running) {
				run();
			}
		});
	}

	enqueue.complete = function () {
		return new Promise(resolve => events.once('complete', resolve));
	};

	return enqueue;
}

module.exports = create;
