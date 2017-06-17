require('../babel/register');
require('bluebird').longStackTraces();
if (process.env.COVERAGE) {
  require('blanket')({
    pattern: require('path').join(__dirname, '../../src/elasticsearch-js')
  });
}