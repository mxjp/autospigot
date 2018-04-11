#!/usr/bin/env node
'use strict';

const UsageError = require('./usage-error');

async function run(argv) {
	const name = argv.shift();
	if (name === 'init') {
		await require('./init')(argv);
	} else if (name === 'start') {
		await require('./start')(argv);
	} else if (name === 'version') {
		await require('./version')(argv);
	} else {
		throw new UsageError('Unknown command: ' + name);
	}
}

if (require.main === module) {
	run(process.argv.slice(2)).catch(err => {
		if (err instanceof UsageError) {
			console.error(err.message);
			process.exit(2);
		} else {
			console.error(err);
			process.exit(1);
		}
	});
} else {
	module.exports = run;
}
