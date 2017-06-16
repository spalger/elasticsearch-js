process.argv.push('--config', require.resolve('../src/webpack_config/browser'));
require('webpack/bin/webpack');