const _ = require('../../src/elasticsearch-js/lib/utils');
const grunt = require('grunt');
const JENKINS_REPORTER = require.resolve('../../test/utils/jenkins-reporter.js');

const config = {
  unit: {
    src: '**/__mocha_tests__/**/*.js',
    options: {
      reporter: 'nyan'
    }
  },

  ci_unit: {
    src: '**/__mocha_tests__/**/*.js',
    options: {
      reporter: 'spec'
    }
  },

  jenkins_unit: {
    src: '**/__mocha_tests__/**/*.js',
    options: {
      reporter: JENKINS_REPORTER
    }
  },

  // run the unit tests, and update coverage.html
  make_coverage_html: {
    src: '**/__mocha_tests__/**/*.js',
    options: {
      reporter: 'html-cov',
      instrument: false,
      require: [
        require.resolve('../../test/coverage_setup'),
      ]
    }
  },

  // for use by travis
  ship_coverage: {
    src: '**/__mocha_tests__/**/*.js',
    options: {
      reporter: 'mocha-lcov-reporter',
      coveralls: true,
      instrument: false,
      require: [
        require.resolve('../../test/coverage_setup'),
      ]
    }
  },

  integration: {
    src: null,
    options: {
      reporter: 'spec'
    }
  },

  jenkins_integration: {
    src: null,
    options: {
      reporter: JENKINS_REPORTER
    }
  }
};

grunt.registerTask('mocha_integration', function (branch) {
  grunt.config.set(
    'mochacov.integration.src',
    'tmp/yaml_tests/' + _.snakeCase(branch) + '/index.js'
  );
  grunt.task.run('mochacov:integration');
});

grunt.registerTask('mocha_jenkins_integration', function (branch) {
  grunt.config.set(
    'mochacov.jenkins_integration.src',
    'tmp/yaml_tests/' + _.snakeCase(branch) + '/index.js'
  );
  grunt.task.run('mochacov:jenkins_integration');
});

module.exports = config;
