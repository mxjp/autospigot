'use strict';

const path = require('path');
const fs = require('fs');

module.exports = fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf8').replace(/\t/g, '    ');
