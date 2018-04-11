'use strict';

const path = require('path');

function formatPath(filename) {
	filename = path.resolve(filename);
	const cwd = process.cwd();
	return filename.startsWith(cwd) ? path.relative(cwd, filename) : filename;
}

module.exports = {formatPath};
