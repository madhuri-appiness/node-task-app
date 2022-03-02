const {fahrenheitToCelsius ,celsiusToFahrenheit} = require('../src/math')


test('convert to F to C',()=>{
    const FtoC = fahrenheitToCelsius(32);
    expect(FtoC).toBe(0);
})


test('convert C to F',()=>{
    const CtoF = celsiusToFahrenheit(0);
    expect(CtoF).toBe(32);
})



