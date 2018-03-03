'use strict';

const path = require('path');
const fs = require('fs');
const readFilesSync = require('./read-files-sync');
const basenameKeys = require('./basename-keys');

const defaultColumns = {
    '': '',
    'name-size-date-owner-mode': '',
};

const isDev = process.NODE_ENV === 'development';
const getDist = (isDev) => isDev ? 'dist-dev' : 'dist';

const dist = getDist(isDev);
const columnsDir = path.join(__dirname, '..', dist, 'columns');
const columnsNames = fs.readdirSync(columnsDir);
const columns = readFilesSync(columnsDir, columnsNames, 'utf8');

module.exports = Object.assign(
    basenameKeys(columns),
    defaultColumns,
);

