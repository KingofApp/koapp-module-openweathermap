describe('openweathermap controller', function(){
  beforeEach(function() {
    browser.driver.manage().window().setSize(400, 666);
    browser.get('http://localhost:8080/#/menu-abcd/openweathermap');
  });

  it('should load module', function() {
    expect(element(by.id('wether-display'))).toBeDefined();
  });

  it('should display data inside the module', function() {
    expect(element(by.css('.icon'))).toBeDefined();
    expect(element(by.css('.temperature'))).toBeDefined();
    expect(element(by.css('.weather'))).toBeDefined();
    expect(element(by.css('.humidWind'))).toBeDefined();
  });

  it('should change the background color', function(){
    var bgColorOptions = ["#003366", "#DA70D6", "#ff8c00", "#40e0d0"];
    element(by.id('mainContainer')).getCssValue('background-color').then(function(bgColor) {
      expect(bgColorOptions).toContain(rgb2hex(bgColor));
    });
  });

  it('should set the right wind icon', function(){
    expect(element(by.css('.from-na-deg')).isPresent()).toBe(false);
  });

});

/* It converts rgb color to hex color.
 * @see http://jsfiddle.net/Mottie/xcqpF/1/light/
 * @example rgba(34, 34, 34, 1) -> #222222
 */
function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}
