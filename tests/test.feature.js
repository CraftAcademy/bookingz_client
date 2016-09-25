describe('Open app', function () {

  beforeEach(function () {
    browser.get('/#');
  });

  it('should be on /display path', function () {
    expect(browser.getLocationAbsUrl()).toMatch('/login');
    //expect(browser.getTitle()).toEqual('Starter');
  });

});
