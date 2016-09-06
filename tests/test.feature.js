describe('Open app', function () {


  beforeEach(function () {
    browser.get('http://localhost:8100/#');

  });

  it('should be on root path', function () {
    expect(browser.getLocationAbsUrl()).toMatch('/');
  });

});
