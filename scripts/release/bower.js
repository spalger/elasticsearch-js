const fs = require('fs');
const spawn = require('../_spawn');
const async = require('async');
const _ = require('lodash');
const resolve = require('path').resolve;

const bowerDir = resolve(__dirname, '../../src/bower_es_js');
const bowerJson = require('../../src/bower_es_js/bower.json'); // eslint-disable-line import/no-unresolved
const bowerPackageJson = require('../../src/bower_es_js/package.json'); // eslint-disable-line import/no-unresolved
const esjsJson = require('../../package.json');

// update the version to match the node version
bowerJson.version = esjsJson.version;
bowerPackageJson.version = esjsJson.version;

// write the new bower.json file
fs.writeFileSync(resolve(bowerDir, 'bower.json'), JSON.stringify(bowerJson, null, '  '));
// write the new package.json file
fs.writeFileSync(resolve(bowerDir, 'package.json'), JSON.stringify(bowerPackageJson, null, '  '));

function make(cmd, args) {
  return _.bind(spawn, null, cmd, args, {
    verbose: true,
    cwd: bowerDir
  });
}

async.series([
  make('git', ['add', '-A']),
  make('git', ['commit', '-m', 'version ' + bowerJson.version]),
  make('git', ['tag', '-a', 'v' + bowerJson.version, '-m', 'version ' + bowerJson.version]),
  make('git', ['push', 'origin', 'master']),
  make('git', ['push', '--tags', 'origin']),
  make('npm', ['publish'])
], function (err) {
  if (err) {
    if (_.isNumber(err)) {
      console.log('Non-zero exit code: %d', err);
    } else {
      console.log('Error: ', err.message ? err.message : err);
    }
  }
});
