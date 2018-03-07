'use strict';

const {
    join,
} = require('path');
const fs = require('fs');
const test = require('tape');
const {promisify} = require('es6-promisify');
const pullout = require('pullout');
const request = require('request');
const before = require('../before');
const rimraf = require('rimraf');

const fixtureDir = join(__dirname, '..', 'fixture') + '/';

const warp = (fn, ...a) => (...b) => fn(...b, ...a);
const _pullout = promisify(pullout);

const put = promisify((url, json, fn) => {
    fn(null, request.put(url, {
        json,
    }));
});

test('cloudcmd: rest: mv', (t) => {
    before({}, (port, after) => {
        const tmp = join(fixtureDir, 'tmp');
        const files = {
            from: '/fixture/',
            to: '/fixture/tmp/',
            names: [
                'mv.txt'
            ]
        };
        
        fs.mkdirSync(tmp);
        
        put(`http://localhost:${port}/api/v1/mv`, files)
            .then(warp(_pullout, 'string'))
            .then((body) => {
                t.equal(body, 'move: ok("["mv.txt"]")', 'should move');
                t.end();
                
                const file = fs.readFileSync(`${tmp}/mv.txt`);
                fs.writeFileSync(`${fixtureDir}/mv.txt`, file);
                
                rimraf.sync(tmp);
                
                after();
            })
            .catch(console.error);
    });
});

