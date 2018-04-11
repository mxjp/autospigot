'use strict';

const packageInfo = require('../package.json');
const UsageError = require('./usage-error');

async function version(argv) {
	if (argv.length > 0) {
		throw new UsageError('The version command cannot take arguments.');
	}
	console.log(`${packageInfo.name} v${packageInfo.version}`);
}

module.exports = version;
