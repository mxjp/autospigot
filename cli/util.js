'use strict';

function restArgs(parsed) {
	const rest = parsed._unknown || [];
	return rest[0] === '--' ? rest.slice(1) : rest;
}

module.exports = {restArgs};
