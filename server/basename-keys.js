'use strict';

const path = require('path');

const getBaseName = (name) => path.basename(name, path.extname(name));

module.exports = (obj) => {
    const result = {};
    
    Object
        .keys(obj)
        .forEach((key) => {
            result[getBaseName(key)] = obj[key];
        });
    
    return result;
};

