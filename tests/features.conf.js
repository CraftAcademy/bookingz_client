exports.config = {
  capabilities: {
    'browserName': 'phantomjs',
    'phantomjs.binary.path': require('phantomjs-prebuilt').path,
    'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
  },
  baseUrl: 'http://localhost:8100',
  specs: [
    '**/*.feature.js'
  ],

  jasmineNodeOpts: {
    isVerbose: true,
    print: function() {}
  },

  onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  }
};
