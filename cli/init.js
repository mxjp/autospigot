'use strict';

const path = require('path');
const parse = require('command-line-args');
const lib = require('..');

async function init(argv) {
	const args = parse([
		{name: 'server', alias: 's'}
	], {argv});
	const basedir = path.resolve(args.server || '.');
	await lib.config.write(basedir, {});
}

module.exports = init;
