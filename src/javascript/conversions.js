class conversions {

  //volume converted to m^3 from 7200000 ft^3
  volume = 203881.2955
  //pressure in pa at elevation 3820 ft
  pressure = 88140.67

  static co2_ppm_to_kg(ppm, temp_celsius) {
    //Converts ppm to kg of CO2 using a variation of the ideal gas law and Biosphere's volume.

    //molecular mass of CO2 in kg
    let mass = 0.0440095
    let percentage = this.ppm_to_percent(ppm) / 100
    let temp_k = this.celsius_to_kelvin(temp_celsius)

    let r = 8.3145

    //modification of PV=nRT (ideal gas law)
    let density = (pressure * mass) / (r * temp_k)
    var kg = density * volume * percentage

    return kg
  }

  static ch4_ppm_to_kg(ppm, temp_celsius) {
    //Converts ppm to kg of CH4 using a variation of the ideal gas law

    //molecular mass of CH4 in kg
    let mass = 0.0160425
    let percentage = this.ppm_to_percent(ppm) / 100
    let temp_k = this.celsius_to_kelvin(temp_celsius)
    let r = 8.3145

    //modification of PV=nRT (ideal gas law)
    let density = (pressure * mass) / (r * temp_k)
    var kg = density * volume * percentage

    return kg
  }



  static humidity_to_kg_water(relHum, temp_celsius) {
    //Converts relative humidity to kg of H20 using variations of Clausius Clapeyron and Ideal Gas Law.
    let temp = this.celsius_to_kelvin(temp_celsius)

    //Find saturation pressure using variation of Clausius Clapeyron equation
    let pws = 611 * Math.exp(((2.5 * Math.pow(10, 6) / 462)) * ((1 / 273.15) - (1 / temp)))

    //Find vapor pressure based off of relative humidity
    let pw = (relHum * pws) / 100

    //Find dry air pressure from total and vapor pressures
    let pd = pressure - pw

    //Find density using variation of Ideal Gas Law
    let density = (pd / (287.058 * temp)) + (pw / (461.495 * temp))
    var kg = density * volume

    return kg
  }

  static ppm_to_percent(ppm) {
    return ppm / 10000
  }

  static celsius_to_kelvin(celsius) {
    return celsius + 273.15
  }

  static celsius_to_fahrenheit(celsius) {
    return (celsius * 1.8) + 32
  }

  static atm_to_pascals(atm) {
    //Converts atmospheres to pascals
    var pascals = atm * 1.01325 * Math.pow(10, 5)
    return pascals
  }

  static bar_to_atm(bar) {
    //Converts bars to atmospheres
    var atmospheres = bar / 1.01325
    return atmospheres
  }
}
