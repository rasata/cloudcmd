'use strict';

const fs = require('fs');
const path = require('path');
const readFilesSync = require('./read-files-sync');
const basenameKeys = require('./basename-keys');
const squad = require('squad/legacy');

const templatePath = path.join(__dirname, '..', 'tmpl/fs');
const templateNames = fs.readdirSync(templatePath);
const readTemplates = squad(basenameKeys, readFilesSync);

module.exports = readTemplates(templatePath, templateNames, 'utf8');

