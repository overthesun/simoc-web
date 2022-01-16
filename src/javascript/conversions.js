class conversions {

  static co2_ppm_to_kg(ppm, temp_celsius) {
    //Converts ppm to kg of CO2 using a variation of the ideal gas law and Biosphere's volume."""
    
    //molecular mass of CO2 in kg
    let mass = 0.044
    //pressure in pa at elevation 3820 ft
    let pressure = 88140.67
    let percentage = ppm / 1000000
    let temp_k = celsius_to_kelvin(temp_celsius)
    //volume converted to m^3 from 7200000 ft^3
    let volume = 203881.2955
    let r = 8.3145

    //modification of PV=nRT (ideal gas law)
    let density = (pressure * mass) / (r * temp_k)
    var kg = density * volume * percentage

    return kg
  }


  static celsius_to_kelvin(celsius) {
    return celsius + 273.15
  }
}
