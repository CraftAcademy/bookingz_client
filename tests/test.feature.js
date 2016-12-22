describe('Configuring the app', function () {

  beforeEach(function () {
    browser.get('/#');
  });

  it('should be on /display path', function () {
    expect(browser.getLocationAbsUrl()).toMatch('/display');
  });

  it('should display no resource message', function () {
    var message = element(by.binding('noResourceMessage'));
    expect(message.getText()).toEqual('Den här enheten är inte konfigurerad.');
  });

  it('should display resource info after set up', function () {
    element(by.css('button[ng-click="manageSettings()"]')).click().then(function(){
      browser.executeScript("window.localStorage.clear();");
      browser.executeScript('window.localStorage.setItem("ngStorage-login_pattern","\"1,2,6,3,4\"");');
      browser.executeScript(function(){
        var pattern = loginService.getLoginPattern();
        console.log(pattern);
      });
      element(by.model('data.f_code')).sendKeys('y1xc');
      element(by.model('data.designation')).sendKeys('Feature Test');
      element(by.model('data.description')).sendKeys('Test resource');
      element(by.model('data.capacity')).sendKeys('10');

      element(by.css('button[ng-click="setSettings(\'create\')"]')).click().then(function () {
        var message = element(by.css('.details'));
        expect(message.getText()).toEqual('Rummet är ledigt')
      });
    });
    browser.waitForAngular();



  });

});
