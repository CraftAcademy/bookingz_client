describe('Open app', function () {

  beforeEach(function () {
    browser.get('/#');
  });

  it('should be on root path', function () {
    expect(browser.getLocationAbsUrl()).toMatch('/');
    //expect(browser.getTitle()).toEqual('Starter');
  });

});
