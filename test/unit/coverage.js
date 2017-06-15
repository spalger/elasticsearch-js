require('blanket')({
  pattern: require('path').join(__dirname, '../../src/elasticsearch-js')
});

require('./index');
