describe('Open app', function () {

  beforeEach(function () {
    browser.get('/#');
  });

  it('should be on /display path', function () {
    expect(browser.getLocationAbsUrl()).toMatch('/display');
  });

  it('should display no resource message', function () {
    var message = element(by.binding('noResourceMessage'))
    expect(message.getText()).toEqual('Den här enheten är inte konfigurerad');
  });

});
