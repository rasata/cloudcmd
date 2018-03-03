'uses strict';

const fs = require('fs');
const path = require('path');
const currify = require('currify/legacy');

const readSync = currify((mode, name) => fs.readFileSync(name, 'utf8'));
const join = currify((dir, name) => path.join(dir, name));
const bindNames = currify((fn, array, value, i) => fn(array[i], value));

const objectify = (key, value) => ({
    [key]: value
});

module.exports = (dir, names, mode) => {
    const columns = names
        .map(join(dir))
        .map(readSync(mode))
        .map(bindNames(objectify, names));
    
    return Object.assign.apply(null, columns)
};

