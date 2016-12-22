
exports.config = {
  capabilities: {
    'browserName': 'phantomjs',
    'phantomjs.binary.path': require('phantomjs-prebuilt').path
  },
  baseUrl: 'http://localhost:8100',
  specs: [
    '**/*.feature.js'
  ],

  jasmineNodeOpts: {
    isVerbose: false,
    print: function() {}
  },

  onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter');
    var HtmlReporter = require('protractor-html-screenshot-reporter');

    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
    //screenshot generator - this is not set up properly yet
    // https://www.npmjs.com/package/protractor-html-screenshot-reporter
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'screenshots', takeScreenShotsOnlyForFailedSpecs: true
    }));
  }
};
