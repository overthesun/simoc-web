static function co2_ppm_to_kg(ppm, temp_celsius, volume, pressure) {
  // Converts ppm to kg of CO2 using a variation of the ideal gas law.
  // Volume expected in m^3, pressure expected in Pa.  

  const mass = 0.0440095 // molecular mass of CO2 in kg
  return this.ppm_to_kg(mass, ppm, temp_celsius, volume, pressure)
}

static function ch4_ppm_to_kg(ppm, temp_celsius, volume, pressure) {
  // Converts ppm to kg of CH4 using a variation of the ideal gas law
  // Volume expected in m^3, pressure expected in Pa.

  const mass = 0.0160425 // molecular mass of CH4 in kg
  return this.ppm_to_kg(mass, ppm, temp_celsius, volume, pressure)
}

static function ppm_to_kg(mass, ppm, temp_celsius, volume, pressure) {
  // Converts ppm to kg of a gas 
  const percentage = this.ppm_to_percent(ppm) / 100
  const temp_k = this.celsius_to_kelvin(temp_celsius)

  // r is the gas constant in (Pa * m^3)/(K * mol)
  // More information at https://en.wikipedia.org/wiki/Gas_constant
  const r = 8.3145

  // Modification of PV=nRT (ideal gas law) to find density -> d = PM/RT
  // More information at https://sciencing.com/convert-molecular-weight-density-5858792.html
  const density = (pressure * mass) / (r * temp_k)

  const kg = density * volume * percentage

  return kg
}

static function humidity_to_kg_water(relHum, temp_celsius, volume, pressure) {
  // Converts relative humidity to kg of H20 using variations of Clausius Clapeyron and Ideal Gas Law.
  const temp = this.celsius_to_kelvin(temp_celsius)

  // Find saturation pressure using variation of Clausius Clapeyron equation
  // More information at https://snowball.millersville.edu/~adecaria/ESCI241/esci241_lesson06_humidity.pdf, pg. 2 specifically
  const pws = 611 * Math.exp(((2.5 * Math.pow(10, 6) / 462)) * ((1 / 273.15) - (1 / temp)))

  // With the saturation pressure known, the following calculations find the information
  //  needed to find the density, from https://www.aqua-calc.com/calculate/humidity

  // Find vapor pressure based off of relative humidity
  const pw = (relHum * pws) / 100

  // Find dry air pressure from total and vapor pressures
  const pd = pressure - pw

  // Find density using variation of Ideal Gas Law
  const density = (pd / (287.058 * temp)) + (pw / (461.495 * temp))
  const kg = density * volume

  return kg
}

static function ppm_to_percent(ppm) {
  return ppm / 10000
}

static function celsius_to_kelvin(celsius) {
  return celsius + 273.15
}

static function celsius_to_fahrenheit(celsius) {
  return (celsius * 1.8) + 32
}

static function atm_to_pascals(atm) {
  // Converts atmospheres to pascals
  const pascals = atm * 1.01325 * Math.pow(10, 5)
  return pascals
}

static function bar_to_atm(bar) {
  // Converts bars to atmospheres
  const atmospheres = bar / 1.01325
  return atmospheres
}

