import type { Category } from "./types";
import { u } from "./factor";

// Length — base meter
const length: Category = {
  id: "length",
  name: "Length",
  description: "Convert meters, feet, inches, miles, kilometers and more.",
  group: "common",
  baseUnit: "m",
  units: [
    u("m", "Meter", "m", 1, ["meters", "metre"]),
    u("km", "Kilometer", "km", 1000),
    u("cm", "Centimeter", "cm", 0.01),
    u("mm", "Millimeter", "mm", 0.001),
    u("um", "Micrometer", "µm", 1e-6),
    u("nm", "Nanometer", "nm", 1e-9),
    u("mi", "Mile", "mi", 1609.344),
    u("yd", "Yard", "yd", 0.9144),
    u("ft", "Foot", "ft", 0.3048, ["feet"]),
    u("in", "Inch", "in", 0.0254, ["inches"]),
    u("nmi", "Nautical Mile", "nmi", 1852),
    u("ly", "Light Year", "ly", 9.4607e15),
    u("au", "Astronomical Unit", "AU", 1.495978707e11),
    u("pc", "Parsec", "pc", 3.0857e16),
  ],
  popular: [
    // Curated from real US search volume (Semrush): mm→cm 74k, in→ft 60k, ft→in 40k, m→cm 40k, nm→m 27k, yd→ft 10k, km→mi & mi→km
    { from: "cm", to: "in" }, { from: "in", to: "cm" },
    { from: "mm", to: "in" }, { from: "in", to: "mm" },
    { from: "mm", to: "cm" }, { from: "cm", to: "mm" },
    { from: "m", to: "ft" }, { from: "ft", to: "m" },
    { from: "m", to: "cm" }, { from: "cm", to: "m" },
    { from: "ft", to: "in" }, { from: "in", to: "ft" },
    { from: "yd", to: "ft" }, { from: "ft", to: "yd" },
    { from: "km", to: "mi" }, { from: "mi", to: "km" },
    { from: "nm", to: "m" }, { from: "m", to: "nm" },
  ],
};

// Weight — base kilogram
const weight: Category = {
  id: "weight",
  name: "Weight & Mass",
  description: "Kilograms, pounds, ounces, tonnes and more. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "kg",
  units: [
    u("kg", "Kilogram", "kg"), u("kg", "Kilogram", "kg", 1).id ? u("kg", "Kilogram", "kg", 1) : u("kg", "Kilogram", "kg", 1),
    u("g", "Gram", "g", 0.001),
    u("mg", "Milligram", "mg", 1e-6),
    u("t", "Metric Ton", "t", 1000),
    u("lb", "Pound", "lb", 0.45359237, ["lbs", "pounds"]),
    u("oz", "Ounce", "oz", 0.028349523125),
    u("st", "Stone", "st", 6.35029318),
    u("ct", "Carat", "ct", 0.0002),
    u("ton_us", "US Ton (short)", "ton", 907.18474),
    u("ton_uk", "UK Ton (long)", "ton", 1016.0469088),
  ].filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i),
  popular: [
    // Curated: lb↔oz 90k, mg→g 60k, g→kg 49k, ton→lb 4k, stone→lb
    { from: "kg", to: "lb" }, { from: "lb", to: "kg" },
    { from: "g", to: "oz" }, { from: "oz", to: "g" },
    { from: "lb", to: "oz" }, { from: "oz", to: "lb" },
    { from: "g", to: "kg" }, { from: "kg", to: "g" },
    { from: "mg", to: "g" }, { from: "g", to: "mg" },
    { from: "t", to: "kg" }, { from: "kg", to: "t" },
    { from: "st", to: "lb" }, { from: "lb", to: "st" },
    { from: "ton_us", to: "lb" }, { from: "lb", to: "ton_us" },
  ],
};

// Fix: rewrite weight cleanly
weight.units = [
  u("kg", "Kilogram", "kg", 1),
  u("g", "Gram", "g", 0.001),
  u("mg", "Milligram", "mg", 1e-6),
  u("t", "Metric Ton", "t", 1000),
  u("lb", "Pound", "lb", 0.45359237, ["lbs", "pounds"]),
  u("oz", "Ounce", "oz", 0.028349523125),
  u("st", "Stone", "st", 6.35029318),
  u("ct", "Carat", "ct", 0.0002),
  u("ton_us", "US Ton (short)", "ton (US)", 907.18474),
  u("ton_uk", "UK Ton (long)", "ton (UK)", 1016.0469088),
];

// Temperature — non-linear, base Celsius
const temperature: Category = {
  id: "temperature",
  name: "Temperature",
  description: "Celsius, Fahrenheit, Kelvin and Rankine. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "c",
  units: [
    { id: "c", name: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
    { id: "f", name: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    { id: "k", name: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    { id: "r", name: "Rankine", symbol: "°R", toBase: (v) => (v - 491.67) * 5/9, fromBase: (v) => (v + 273.15) * 9/5 },
  ],
  popular: [
    { from: "c", to: "f" }, { from: "f", to: "c" },
    { from: "c", to: "k" }, { from: "k", to: "c" },
  ],
};

// Volume — base liter
const volume: Category = {
  id: "volume",
  name: "Volume",
  description: "Liters, gallons, cups, milliliters and more. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "L",
  units: [
    u("L", "Liter", "L", 1),
    u("mL", "Milliliter", "mL", 0.001),
    u("m3", "Cubic Meter", "m³", 1000),
    u("cm3", "Cubic Centimeter", "cm³", 0.001),
    u("gal_us", "US Gallon", "gal", 3.785411784),
    u("gal_uk", "UK Gallon", "gal (UK)", 4.54609),
    u("qt", "US Quart", "qt", 0.946352946),
    u("pt", "US Pint", "pt", 0.473176473),
    u("cup", "US Cup", "cup", 0.2365882365),
    u("floz", "US Fluid Ounce", "fl oz", 0.0295735296),
    u("tbsp", "Tablespoon", "tbsp", 0.0147867648),
    u("tsp", "Teaspoon", "tsp", 0.0049289216),
    u("bbl", "Oil Barrel", "bbl", 158.987294928),
  ],
  popular: [
    // Curated: ml→oz 246k, oz→ml 165k, L→gal 110k, gal→L 27k, tsp/cup/tbsp→ml
    { from: "L", to: "gal_us" }, { from: "gal_us", to: "L" },
    { from: "mL", to: "floz" }, { from: "floz", to: "mL" },
    { from: "cup", to: "mL" }, { from: "mL", to: "cup" },
    { from: "tbsp", to: "mL" }, { from: "mL", to: "tbsp" },
    { from: "tsp", to: "mL" }, { from: "mL", to: "tsp" },
    { from: "qt", to: "L" }, { from: "L", to: "qt" },
    { from: "pt", to: "mL" }, { from: "mL", to: "pt" },
    { from: "gal_uk", to: "L" }, { from: "L", to: "gal_uk" },
  ],
};

// Area — base m²
const area: Category = {
  id: "area",
  name: "Area",
  description: "Square meters, acres, hectares, square feet. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "m2",
  units: [
    u("m2", "Square Meter", "m²", 1),
    u("km2", "Square Kilometer", "km²", 1e6),
    u("cm2", "Square Centimeter", "cm²", 1e-4),
    u("mm2", "Square Millimeter", "mm²", 1e-6),
    u("ha", "Hectare", "ha", 10000),
    u("ac", "Acre", "ac", 4046.8564224),
    u("ft2", "Square Foot", "ft²", 0.09290304),
    u("in2", "Square Inch", "in²", 0.00064516),
    u("yd2", "Square Yard", "yd²", 0.83612736),
    u("mi2", "Square Mile", "mi²", 2589988.110336),
  ],
  popular: [
    // acre↔sqft 14k, hectare↔acre 10k, sqm↔sqft 8k
    { from: "ac", to: "ft2" }, { from: "ft2", to: "ac" },
    { from: "ha", to: "ac" }, { from: "ac", to: "ha" },
    { from: "m2", to: "ft2" }, { from: "ft2", to: "m2" },
    { from: "km2", to: "mi2" }, { from: "mi2", to: "km2" },
    { from: "cm2", to: "in2" }, { from: "in2", to: "cm2" },
  ],
};

// Pressure — base Pascal
const pressure: Category = {
  id: "pressure",
  name: "Pressure",
  description: "Pascals, bars, PSI, atmospheres. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "Pa",
  units: [
    u("Pa", "Pascal", "Pa", 1),
    u("kPa", "Kilopascal", "kPa", 1000),
    u("MPa", "Megapascal", "MPa", 1e6),
    u("bar", "Bar", "bar", 1e5),
    u("mbar", "Millibar", "mbar", 100),
    u("psi", "Pound per Sq. Inch", "psi", 6894.757293168),
    u("atm", "Atmosphere", "atm", 101325),
    u("torr", "Torr", "Torr", 133.322368421),
    u("mmHg", "Millimeter of Mercury", "mmHg", 133.322387415),
  ],
  popular: [
    // bar↔psi 33k+15k, kpa→psi 27k
    { from: "bar", to: "psi" }, { from: "psi", to: "bar" },
    { from: "kPa", to: "psi" }, { from: "psi", to: "kPa" },
    { from: "Pa", to: "psi" }, { from: "psi", to: "Pa" },
    { from: "atm", to: "psi" }, { from: "psi", to: "atm" },
    { from: "mmHg", to: "psi" }, { from: "psi", to: "mmHg" },
    { from: "bar", to: "kPa" }, { from: "kPa", to: "bar" },
  ],
};

// Energy — base Joule
const energy: Category = {
  id: "energy",
  name: "Energy",
  description: "Joules, calories, kilowatt-hours, BTU. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "J",
  units: [
    u("J", "Joule", "J", 1),
    u("kJ", "Kilojoule", "kJ", 1000),
    u("cal", "Calorie", "cal", 4.184),
    u("kcal", "Kilocalorie", "kcal", 4184),
    u("Wh", "Watt-hour", "Wh", 3600),
    u("kWh", "Kilowatt-hour", "kWh", 3.6e6),
    u("BTU", "British Thermal Unit", "BTU", 1055.05585262),
    u("eV", "Electronvolt", "eV", 1.602176634e-19),
    u("ftlb", "Foot-pound", "ft·lb", 1.35581794833),
  ],
  popular: [
    // joules↔calories 8k, kcal→kJ 5k, btu→kwh
    { from: "J", to: "cal" }, { from: "cal", to: "J" },
    { from: "kcal", to: "kJ" }, { from: "kJ", to: "kcal" },
    { from: "kWh", to: "J" }, { from: "J", to: "kWh" },
    { from: "BTU", to: "kWh" }, { from: "kWh", to: "BTU" },
    { from: "Wh", to: "J" }, { from: "J", to: "Wh" },
  ],
};

// Power — base Watt
const power: Category = {
  id: "power",
  name: "Power",
  description: "Watts, horsepower, kilowatts. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "W",
  units: [
    u("W", "Watt", "W", 1),
    u("kW", "Kilowatt", "kW", 1000),
    u("MW", "Megawatt", "MW", 1e6),
    u("hp", "Horsepower (mech)", "hp", 745.6998715822702),
    u("hp_m", "Horsepower (metric)", "hp (M)", 735.49875),
    u("BTU_h", "BTU/hour", "BTU/h", 0.29307107),
    u("ftlb_s", "Foot-pound/second", "ft·lb/s", 1.3558179483),
  ],
  popular: [
    // kw↔hp 22k+10k, MW↔hp
    { from: "hp", to: "kW" }, { from: "kW", to: "hp" },
    { from: "W", to: "hp" }, { from: "hp", to: "W" },
    { from: "kW", to: "BTU_h" }, { from: "BTU_h", to: "kW" },
    { from: "MW", to: "hp" }, { from: "hp", to: "MW" },
  ],
};

// Force — base Newton
const force: Category = {
  id: "force",
  name: "Force",
  description: "Newtons, pounds-force, dynes. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "N",
  units: [
    u("N", "Newton", "N", 1),
    u("kN", "Kilonewton", "kN", 1000),
    u("lbf", "Pound-force", "lbf", 4.4482216152605),
    u("kgf", "Kilogram-force", "kgf", 9.80665),
    u("dyn", "Dyne", "dyn", 1e-5),
  ],
};

// Time — base second
const time: Category = {
  id: "time",
  name: "Time",
  description: "Seconds, minutes, hours, days, years. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "s",
  units: [
    u("s", "Second", "s", 1),
    u("ms", "Millisecond", "ms", 1e-3),
    u("us", "Microsecond", "µs", 1e-6),
    u("min", "Minute", "min", 60),
    u("h", "Hour", "h", 3600),
    u("d", "Day", "d", 86400),
    u("wk", "Week", "wk", 604800),
    u("mo", "Month (30 d)", "mo", 2592000),
    u("yr", "Year (365 d)", "yr", 31536000),
  ],
  popular: [
    { from: "N", to: "lbf" }, { from: "lbf", to: "N" },
    { from: "kN", to: "lbf" }, { from: "lbf", to: "kN" },
    { from: "kgf", to: "N" }, { from: "N", to: "kgf" },
  ],
  popular: [
    // minutes↔hours 33k, seconds↔minutes 22k, days↔hours
    { from: "min", to: "h" }, { from: "h", to: "min" },
    { from: "s", to: "min" }, { from: "min", to: "s" },
    { from: "d", to: "h" }, { from: "h", to: "d" },
    { from: "ms", to: "s" }, { from: "s", to: "ms" },
    { from: "yr", to: "d" }, { from: "d", to: "yr" },
    { from: "wk", to: "d" }, { from: "d", to: "wk" },
  ],
};

// Speed — base m/s
const speed: Category = {
  id: "speed",
  name: "Speed",
  description: "m/s, km/h, mph, knots. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "mps",
  units: [
    u("mps", "Meter/second", "m/s", 1),
    u("kph", "Kilometer/hour", "km/h", 1 / 3.6),
    u("mph", "Mile/hour", "mph", 0.44704),
    u("fps", "Foot/second", "ft/s", 0.3048),
    u("knot", "Knot", "kn", 0.514444),
    u("mach", "Mach (sea level)", "M", 340.29),
  ],
  popular: [
    // knots→mph 60k, fps↔mph
    { from: "mph", to: "kph" }, { from: "kph", to: "mph" },
    { from: "knot", to: "mph" }, { from: "mph", to: "knot" },
    { from: "knot", to: "kph" }, { from: "kph", to: "knot" },
    { from: "mps", to: "mph" }, { from: "mph", to: "mps" },
    { from: "mps", to: "kph" }, { from: "kph", to: "mps" },
    { from: "fps", to: "mph" }, { from: "mph", to: "fps" },
  ],
};

// Angle — base radian
const angle: Category = {
  id: "angle",
  name: "Angle",
  description: "Degrees, radians, gradians. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "rad",
  units: [
    u("rad", "Radian", "rad", 1),
    u("deg", "Degree", "°", Math.PI / 180),
    u("grad", "Gradian", "grad", Math.PI / 200),
    u("arcmin", "Arcminute", "'", Math.PI / 10800),
    u("arcsec", "Arcsecond", '"', Math.PI / 648000),
    u("turn", "Turn", "tr", Math.PI * 2),
  ],
  popular: [{ from: "deg", to: "rad" }, { from: "rad", to: "deg" }],
};

// Data storage — base byte
const data: Category = {
  id: "data",
  name: "Data Storage",
  description: "Bytes, kilobytes, megabytes, gigabytes. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "B",
  units: [
    u("b", "Bit", "b", 0.125),
    u("B", "Byte", "B", 1),
    u("KB", "Kilobyte", "KB", 1e3),
    u("MB", "Megabyte", "MB", 1e6),
    u("GB", "Gigabyte", "GB", 1e9),
    u("TB", "Terabyte", "TB", 1e12),
    u("PB", "Petabyte", "PB", 1e15),
    u("KiB", "Kibibyte", "KiB", 1024),
    u("MiB", "Mebibyte", "MiB", 1024 ** 2),
    u("GiB", "Gibibyte", "GiB", 1024 ** 3),
    u("TiB", "Tebibyte", "TiB", 1024 ** 4),
  ],
};

// Fuel consumption — base L/100km
const fuel: Category = {
  id: "fuel",
  name: "Fuel Consumption",
  description: "L/100km, MPG (US), MPG (UK), km/L. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "common",
  baseUnit: "lp100km",
  units: [
    { id: "lp100km", name: "Liter/100 km", symbol: "L/100km", toBase: (v) => v, fromBase: (v) => v },
    { id: "kmpl", name: "Kilometer/Liter", symbol: "km/L", toBase: (v) => 100 / v, fromBase: (v) => 100 / v },
    { id: "mpg_us", name: "Miles/Gallon (US)", symbol: "mpg", toBase: (v) => 235.214583 / v, fromBase: (v) => 235.214583 / v },
    { id: "mpg_uk", name: "Miles/Gallon (UK)", symbol: "mpg (UK)", toBase: (v) => 282.480936 / v, fromBase: (v) => 282.480936 / v },
  ],
};

// Frequency
const frequency: Category = {
  id: "frequency",
  name: "Frequency",
  description: "Hertz, kilohertz, megahertz, gigahertz. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "light",
  baseUnit: "Hz",
  units: [
    u("Hz", "Hertz", "Hz", 1),
    u("kHz", "Kilohertz", "kHz", 1e3),
    u("MHz", "Megahertz", "MHz", 1e6),
    u("GHz", "Gigahertz", "GHz", 1e9),
    u("THz", "Terahertz", "THz", 1e12),
    u("rpm", "Revolutions/min", "rpm", 1 / 60),
  ],
  popular: [
    // mb↔gb 53k, kb→mb 33k, gb↔tb
    { from: "MB", to: "GB" }, { from: "GB", to: "MB" },
    { from: "KB", to: "MB" }, { from: "MB", to: "KB" },
    { from: "GB", to: "TB" }, { from: "TB", to: "GB" },
    { from: "B", to: "KB" }, { from: "KB", to: "B" },
    { from: "b", to: "B" }, { from: "B", to: "b" },
    { from: "MiB", to: "MB" }, { from: "GiB", to: "GB" },
  ],
};

// Density — base kg/m³
const density: Category = {
  id: "density",
  name: "Density",
  description: "Kilogram/m³, g/cm³, lb/ft³. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "engineering",
  baseUnit: "kgm3",
  units: [
    u("kgm3", "Kilogram/m³", "kg/m³", 1),
    u("gcm3", "Gram/cm³", "g/cm³", 1000),
    u("gml", "Gram/mL", "g/mL", 1000),
    u("lbft3", "Pound/ft³", "lb/ft³", 16.018463374),
    u("lbin3", "Pound/in³", "lb/in³", 27679.904710203),
  ],
};

// Acceleration — base m/s²
const acceleration: Category = {
  id: "acceleration",
  name: "Acceleration",
  description: "m/s², g-force, ft/s². Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "engineering",
  baseUnit: "mps2",
  units: [
    u("mps2", "Meter/sec²", "m/s²", 1),
    u("g", "Standard Gravity", "g", 9.80665),
    u("fps2", "Foot/sec²", "ft/s²", 0.3048),
    u("gal", "Galileo", "Gal", 0.01),
  ],
};

// Torque — base N·m
const torque: Category = {
  id: "torque",
  name: "Torque",
  description: "Newton-meters, foot-pounds. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "engineering",
  baseUnit: "Nm",
  units: [
    u("Nm", "Newton-meter", "N·m", 1),
    u("kNm", "Kilonewton-meter", "kN·m", 1000),
    u("ftlb", "Foot-pound", "ft·lb", 1.355817948),
    u("inlb", "Inch-pound", "in·lb", 0.112984829),
    u("kgfm", "Kilogram-force meter", "kgf·m", 9.80665),
  ],
};

// Electric current — base ampere
const current: Category = {
  id: "current",
  name: "Electric Current",
  description: "Amperes, milliamperes. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "electricity",
  baseUnit: "A",
  units: [
    u("A", "Ampere", "A", 1),
    u("mA", "Milliampere", "mA", 1e-3),
    u("uA", "Microampere", "µA", 1e-6),
    u("kA", "Kiloampere", "kA", 1e3),
  ],
};

// Voltage
const voltage: Category = {
  id: "voltage",
  name: "Electric Potential",
  description: "Volts, millivolts, kilovolts. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "electricity",
  baseUnit: "V",
  units: [
    u("V", "Volt", "V", 1),
    u("mV", "Millivolt", "mV", 1e-3),
    u("kV", "Kilovolt", "kV", 1e3),
    u("MV", "Megavolt", "MV", 1e6),
  ],
};

// Resistance
const resistance: Category = {
  id: "resistance",
  name: "Electric Resistance",
  description: "Ohms, kiloohms, megaohms. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "electricity",
  baseUnit: "ohm",
  units: [
    u("ohm", "Ohm", "Ω", 1),
    u("kohm", "Kiloohm", "kΩ", 1e3),
    u("Mohm", "Megaohm", "MΩ", 1e6),
    u("mohm", "Milliohm", "mΩ", 1e-3),
  ],
};

// Flow rate — base m³/s
const flow: Category = {
  id: "flow",
  name: "Flow Rate",
  description: "Cubic meters/sec, liters/min, gallons/min. Fast, accurate conversions with engineering-grade precision for everyday and professional use.",
  group: "fluids",
  baseUnit: "m3s",
  units: [
    u("m3s", "Cubic m/sec", "m³/s", 1),
    u("Ls", "Liter/sec", "L/s", 1e-3),
    u("Lmin", "Liter/min", "L/min", 1.6667e-5),
    u("gpm_us", "Gallon/min (US)", "gpm", 6.30902e-5),
    u("cfm", "Cubic ft/min", "cfm", 4.71947e-4),
  ],
};

// ===== Engineering =====
const velocityAngular: Category = {
  id: "velocity-angular", name: "Angular Velocity", description: "rad/s, deg/s, rpm and more.",
  group: "engineering", baseUnit: "radps",
  units: [
    u("radps", "Radian/second", "rad/s", 1),
    u("degps", "Degree/second", "°/s", Math.PI / 180),
    u("revps", "Revolution/second", "rev/s", 2 * Math.PI),
    u("rpm", "Revolution/minute", "rpm", Math.PI / 30),
    u("revph", "Revolution/hour", "rev/h", Math.PI / 1800),
  ],
};

const accelerationAngular: Category = {
  id: "acceleration-angular", name: "Angular Acceleration", description: "rad/s², deg/s², rev/s².",
  group: "engineering", baseUnit: "radps2",
  units: [
    u("radps2", "Radian/second²", "rad/s²", 1),
    u("degps2", "Degree/second²", "°/s²", Math.PI / 180),
    u("revps2", "Revolution/second²", "rev/s²", 2 * Math.PI),
    u("revpm2", "Revolution/minute²", "rev/min²", (2 * Math.PI) / 3600),
  ],
};

const specificVolume: Category = {
  id: "specific-volume", name: "Specific Volume", description: "m³/kg, cm³/g, ft³/lb.",
  group: "engineering", baseUnit: "m3kg",
  units: [
    u("m3kg", "Cubic meter/kilogram", "m³/kg", 1),
    u("cm3g", "Cubic centimeter/gram", "cm³/g", 0.001),
    u("Lkg", "Liter/kilogram", "L/kg", 0.001),
    u("ft3lb", "Cubic foot/pound", "ft³/lb", 0.06242796),
  ],
};

const momentOfInertia: Category = {
  id: "moment-of-inertia", name: "Moment of Inertia", description: "kg·m², lb·ft², lb·in².",
  group: "engineering", baseUnit: "kgm2",
  units: [
    u("kgm2", "Kilogram·meter²", "kg·m²", 1),
    u("gcm2", "Gram·centimeter²", "g·cm²", 1e-7),
    u("lbft2", "Pound·foot²", "lb·ft²", 0.04214011),
    u("lbin2", "Pound·inch²", "lb·in²", 0.000292639),
    u("slugft2", "Slug·foot²", "slug·ft²", 1.355817948),
  ],
};

const momentOfForce: Category = {
  id: "moment-of-force", name: "Moment of Force", description: "Newton-meter, kgf·m, lbf·ft.",
  group: "engineering", baseUnit: "Nm",
  units: [
    u("Nm", "Newton-meter", "N·m", 1),
    u("kNm", "Kilonewton-meter", "kN·m", 1000),
    u("mNm", "Millinewton-meter", "mN·m", 0.001),
    u("kgfm", "Kilogram-force meter", "kgf·m", 9.80665),
    u("lbfft", "Pound-force foot", "lbf·ft", 1.355817948),
    u("lbfin", "Pound-force inch", "lbf·in", 0.112984829),
  ],
};

// ===== Heat =====
const fuelEffMass: Category = {
  id: "fuel-efficiency-mass", name: "Fuel Efficiency (Mass)", description: "J/kg, kJ/kg, BTU/lb.",
  group: "heat", baseUnit: "Jkg",
  units: [
    u("Jkg", "Joule/kilogram", "J/kg", 1),
    u("kJkg", "Kilojoule/kilogram", "kJ/kg", 1000),
    u("calg", "Calorie/gram", "cal/g", 4184),
    u("kcalkg", "Kilocalorie/kilogram", "kcal/kg", 4184),
    u("BTUlb", "BTU/pound", "BTU/lb", 2326),
  ],
};

const fuelEffVolume: Category = {
  id: "fuel-efficiency-volume", name: "Fuel Efficiency (Volume)", description: "J/m³, kJ/m³, BTU/ft³.",
  group: "heat", baseUnit: "Jm3",
  units: [
    u("Jm3", "Joule/cubic meter", "J/m³", 1),
    u("kJm3", "Kilojoule/cubic meter", "kJ/m³", 1000),
    u("calcm3", "Calorie/cubic centimeter", "cal/cm³", 4.184e6),
    u("BTUft3", "BTU/cubic foot", "BTU/ft³", 37258.9458),
    u("thermgal", "Therm/US gallon", "therm/gal", 2.787163e10),
  ],
};

const tempInterval: Category = {
  id: "temperature-interval", name: "Temperature Interval", description: "Kelvin, Celsius, Fahrenheit intervals.",
  group: "heat", baseUnit: "K",
  units: [
    u("K", "Kelvin", "K", 1),
    u("C", "Celsius", "°C", 1),
    u("F", "Fahrenheit", "°F", 5 / 9),
    u("R", "Rankine", "°R", 5 / 9),
  ],
};

const thermalExpansion: Category = {
  id: "thermal-expansion", name: "Thermal Expansion", description: "Coefficient of linear expansion.",
  group: "heat", baseUnit: "perK",
  units: [
    u("perK", "1/Kelvin", "1/K", 1),
    u("perC", "1/Celsius", "1/°C", 1),
    u("perF", "1/Fahrenheit", "1/°F", 1.8),
    u("perR", "1/Rankine", "1/°R", 1.8),
  ],
};

const thermalResistance: Category = {
  id: "thermal-resistance", name: "Thermal Resistance", description: "K/W, °F·h/BTU.",
  group: "heat", baseUnit: "KW",
  units: [
    u("KW", "Kelvin/Watt", "K/W", 1),
    u("FhBTU", "°F·h/BTU", "°F·h/BTU", 1.895634),
  ],
};

const thermalConductivity: Category = {
  id: "thermal-conductivity", name: "Thermal Conductivity", description: "W/(m·K), BTU/(h·ft·°F).",
  group: "heat", baseUnit: "WmK",
  units: [
    u("WmK", "Watt/(m·K)", "W/(m·K)", 1),
    u("calscm", "cal/(s·cm·°C)", "cal/(s·cm·°C)", 418.4),
    u("BTUhft", "BTU/(h·ft·°F)", "BTU/(h·ft·°F)", 1.730735),
    u("BTUinft2", "BTU·in/(h·ft²·°F)", "BTU·in/(h·ft²·°F)", 0.144228),
  ],
};

const specificHeat: Category = {
  id: "specific-heat-capacity", name: "Specific Heat Capacity", description: "J/(kg·K), BTU/(lb·°F).",
  group: "heat", baseUnit: "JkgK",
  units: [
    u("JkgK", "Joule/(kg·K)", "J/(kg·K)", 1),
    u("kJkgK", "Kilojoule/(kg·K)", "kJ/(kg·K)", 1000),
    u("calgC", "Calorie/(g·°C)", "cal/(g·°C)", 4184),
    u("BTUlbF", "BTU/(lb·°F)", "BTU/(lb·°F)", 4186.8),
  ],
};

const heatDensity: Category = {
  id: "heat-density", name: "Heat Density", description: "J/m², BTU/ft².",
  group: "heat", baseUnit: "Jm2",
  units: [
    u("Jm2", "Joule/m²", "J/m²", 1),
    u("kJm2", "Kilojoule/m²", "kJ/m²", 1000),
    u("calcm2", "Calorie/cm²", "cal/cm²", 41840),
    u("BTUft2", "BTU/ft²", "BTU/ft²", 11356.5267),
  ],
};

const heatFluxDensity: Category = {
  id: "heat-flux-density", name: "Heat Flux Density", description: "W/m², BTU/(h·ft²).",
  group: "heat", baseUnit: "Wm2",
  units: [
    u("Wm2", "Watt/m²", "W/m²", 1),
    u("kWm2", "Kilowatt/m²", "kW/m²", 1000),
    u("calscm2", "cal/(s·cm²)", "cal/(s·cm²)", 41840),
    u("BTUhft2", "BTU/(h·ft²)", "BTU/(h·ft²)", 3.15459),
  ],
};

const heatTransferCoef: Category = {
  id: "heat-transfer-coefficient", name: "Heat Transfer Coefficient", description: "W/(m²·K), BTU/(h·ft²·°F).",
  group: "heat", baseUnit: "Wm2K",
  units: [
    u("Wm2K", "Watt/(m²·K)", "W/(m²·K)", 1),
    u("calscm2C", "cal/(s·cm²·°C)", "cal/(s·cm²·°C)", 41868),
    u("BTUhft2F", "BTU/(h·ft²·°F)", "BTU/(h·ft²·°F)", 5.678263),
  ],
};

// ===== Fluids =====
const flowMass: Category = {
  id: "flow-mass", name: "Mass Flow", description: "kg/s, kg/h, lb/h, ton/h.",
  group: "fluids", baseUnit: "kgs",
  units: [
    u("kgs", "Kilogram/second", "kg/s", 1),
    u("kgmin", "Kilogram/minute", "kg/min", 1 / 60),
    u("kgh", "Kilogram/hour", "kg/h", 1 / 3600),
    u("gs", "Gram/second", "g/s", 0.001),
    u("lbs", "Pound/second", "lb/s", 0.45359237),
    u("lbh", "Pound/hour", "lb/h", 0.45359237 / 3600),
    u("tonh", "Ton/hour (metric)", "t/h", 1000 / 3600),
  ],
};

const flowMolar: Category = {
  id: "flow-molar", name: "Molar Flow", description: "mol/s, mmol/s, kmol/h.",
  group: "fluids", baseUnit: "mols",
  units: [
    u("mols", "Mole/second", "mol/s", 1),
    u("mmols", "Millimole/second", "mmol/s", 0.001),
    u("kmols", "Kilomole/second", "kmol/s", 1000),
    u("molmin", "Mole/minute", "mol/min", 1 / 60),
    u("molh", "Mole/hour", "mol/h", 1 / 3600),
  ],
};

const massFluxDensity: Category = {
  id: "mass-flux-density", name: "Mass Flux Density", description: "kg/(m²·s), lb/(ft²·s).",
  group: "fluids", baseUnit: "kgm2s",
  units: [
    u("kgm2s", "Kilogram/(m²·s)", "kg/(m²·s)", 1),
    u("gcm2s", "Gram/(cm²·s)", "g/(cm²·s)", 10),
    u("lbft2s", "Pound/(ft²·s)", "lb/(ft²·s)", 4.882428),
  ],
};

const concentrationMolar: Category = {
  id: "concentration-molar", name: "Molar Concentration", description: "mol/m³, mol/L, mmol/L.",
  group: "fluids", baseUnit: "molm3",
  units: [
    u("molm3", "Mole/m³", "mol/m³", 1),
    u("molL", "Mole/liter", "mol/L", 1000),
    u("mmolL", "Millimole/liter", "mmol/L", 1),
    u("molcm3", "Mole/cm³", "mol/cm³", 1e6),
  ],
};

const concentrationSolution: Category = {
  id: "concentration-solution", name: "Solution Concentration", description: "kg/m³, g/L, mg/L.",
  group: "fluids", baseUnit: "kgm3",
  units: [
    u("kgm3", "Kilogram/m³", "kg/m³", 1),
    u("gL", "Gram/liter", "g/L", 1),
    u("mgL", "Milligram/liter", "mg/L", 0.001),
    u("ppm", "Parts per million", "ppm", 0.001),
    u("ozgal_us", "Ounce/gallon (US)", "oz/gal", 7.489152),
  ],
};

const viscosityDynamic: Category = {
  id: "viscosity-dynamic", name: "Dynamic Viscosity", description: "Pa·s, poise, centipoise.",
  group: "fluids", baseUnit: "Pas",
  units: [
    u("Pas", "Pascal·second", "Pa·s", 1),
    u("mPas", "Millipascal·second", "mPa·s", 0.001),
    u("P", "Poise", "P", 0.1),
    u("cP", "Centipoise", "cP", 0.001),
    u("lbfft2s", "lbf·s/ft²", "lbf·s/ft²", 47.880259),
  ],
};

const viscosityKinematic: Category = {
  id: "viscosity-kinematic", name: "Kinematic Viscosity", description: "m²/s, stokes, centistokes.",
  group: "fluids", baseUnit: "m2s",
  units: [
    u("m2s", "Square meter/second", "m²/s", 1),
    u("mm2s", "Square millimeter/second", "mm²/s", 1e-6),
    u("St", "Stokes", "St", 1e-4),
    u("cSt", "Centistokes", "cSt", 1e-6),
    u("ft2s", "Square foot/second", "ft²/s", 0.092903),
  ],
};

const surfaceTension: Category = {
  id: "surface-tension", name: "Surface Tension", description: "N/m, dyn/cm, lbf/in.",
  group: "fluids", baseUnit: "Nm",
  units: [
    u("Nm", "Newton/meter", "N/m", 1),
    u("mNm", "Millinewton/meter", "mN/m", 0.001),
    u("dyncm", "Dyne/centimeter", "dyn/cm", 0.001),
    u("lbfin", "Pound-force/inch", "lbf/in", 175.126837),
  ],
};

const permeability: Category = {
  id: "permeability", name: "Permeability", description: "kg/(Pa·s·m²) and related units.",
  group: "fluids", baseUnit: "kgPasm2",
  units: [
    u("kgPasm2", "Kilogram/(Pa·s·m²)", "kg/(Pa·s·m²)", 1),
    u("permsi", "Perm (0°C)", "perm", 5.72135e-11),
    u("perminsi", "Perm·inch (0°C)", "perm·in", 1.45322e-12),
  ],
};

// ===== Light =====
const luminance: Category = {
  id: "luminance", name: "Luminance", description: "cd/m², lambert, footlambert.",
  group: "light", baseUnit: "cdm2",
  units: [
    u("cdm2", "Candela/m²", "cd/m²", 1),
    u("cdcm2", "Candela/cm²", "cd/cm²", 10000),
    u("cdft2", "Candela/ft²", "cd/ft²", 10.7639),
    u("lambert", "Lambert", "L", 3183.0989),
    u("ftL", "Foot-lambert", "fL", 3.4262591),
    u("nit", "Nit", "nt", 1),
    u("stilb", "Stilb", "sb", 10000),
  ],
};

const luminousIntensity: Category = {
  id: "luminous-intensity", name: "Luminous Intensity", description: "Candela, candlepower.",
  group: "light", baseUnit: "cd",
  units: [
    u("cd", "Candela", "cd", 1),
    u("cp", "Candlepower", "cp", 0.981),
    u("HK", "Hefner candle", "HK", 0.903),
  ],
};

const illumination: Category = {
  id: "illumination", name: "Illumination", description: "Lux, phot, footcandle.",
  group: "light", baseUnit: "lx",
  units: [
    u("lx", "Lux", "lx", 1),
    u("ph", "Phot", "ph", 10000),
    u("fc", "Footcandle", "fc", 10.76391),
    u("nox", "Nox", "nox", 0.001),
  ],
};

const dpi: Category = {
  id: "digital-image-resolution", name: "Digital Image Resolution", description: "DPI, dot/cm, pixel/mm.",
  group: "light", baseUnit: "dpi",
  units: [
    u("dpi", "Dot/inch", "dpi", 1),
    u("dpcm", "Dot/centimeter", "dpcm", 2.54),
    u("dpmm", "Dot/millimeter", "dpmm", 25.4),
    u("ppi", "Pixel/inch", "ppi", 1),
    u("ppm", "Pixel/meter", "ppm", 0.0254),
  ],
};

// ===== Electricity =====
const charge: Category = {
  id: "charge", name: "Electric Charge", description: "Coulomb, ampere-hour, electron charge.",
  group: "electricity", baseUnit: "C",
  units: [
    u("C", "Coulomb", "C", 1),
    u("mC", "Millicoulomb", "mC", 1e-3),
    u("uC", "Microcoulomb", "µC", 1e-6),
    u("nC", "Nanocoulomb", "nC", 1e-9),
    u("kC", "Kilocoulomb", "kC", 1e3),
    u("Ah", "Ampere-hour", "Ah", 3600),
    u("mAh", "Milliampere-hour", "mAh", 3.6),
    u("e", "Electron charge", "e", 1.602176634e-19),
  ],
};

const linearChargeDensity: Category = {
  id: "linear-charge-density", name: "Linear Charge Density", description: "C/m, C/cm, C/in.",
  group: "electricity", baseUnit: "Cm",
  units: [
    u("Cm", "Coulomb/meter", "C/m", 1),
    u("Ccm", "Coulomb/centimeter", "C/cm", 100),
    u("Cin", "Coulomb/inch", "C/in", 39.3700787),
  ],
};

const surfaceChargeDensity: Category = {
  id: "surface-charge-density", name: "Surface Charge Density", description: "C/m², C/cm², C/in².",
  group: "electricity", baseUnit: "Cm2",
  units: [
    u("Cm2", "Coulomb/m²", "C/m²", 1),
    u("Ccm2", "Coulomb/cm²", "C/cm²", 10000),
    u("Cin2", "Coulomb/in²", "C/in²", 1550.0031),
  ],
};

const volumeChargeDensity: Category = {
  id: "volume-charge-density", name: "Volume Charge Density", description: "C/m³, C/cm³, C/in³.",
  group: "electricity", baseUnit: "Cm3",
  units: [
    u("Cm3", "Coulomb/m³", "C/m³", 1),
    u("Ccm3", "Coulomb/cm³", "C/cm³", 1e6),
    u("Cin3", "Coulomb/in³", "C/in³", 61023.7441),
  ],
};

const linearCurrentDensity: Category = {
  id: "linear-current-density", name: "Linear Current Density", description: "A/m, A/cm, A/in.",
  group: "electricity", baseUnit: "Am",
  units: [
    u("Am", "Ampere/meter", "A/m", 1),
    u("Acm", "Ampere/centimeter", "A/cm", 100),
    u("Ain", "Ampere/inch", "A/in", 39.3700787),
  ],
};

const surfaceCurrentDensity: Category = {
  id: "surface-current-density", name: "Surface Current Density", description: "A/m², A/cm², A/in².",
  group: "electricity", baseUnit: "Am2",
  units: [
    u("Am2", "Ampere/m²", "A/m²", 1),
    u("Acm2", "Ampere/cm²", "A/cm²", 10000),
    u("Ain2", "Ampere/in²", "A/in²", 1550.0031),
  ],
};

const eFieldStrength: Category = {
  id: "electric-field-strength", name: "Electric Field Strength", description: "V/m, V/cm, V/in, kV/m.",
  group: "electricity", baseUnit: "Vm",
  units: [
    u("Vm", "Volt/meter", "V/m", 1),
    u("Vcm", "Volt/centimeter", "V/cm", 100),
    u("Vin", "Volt/inch", "V/in", 39.3700787),
    u("kVm", "Kilovolt/meter", "kV/m", 1000),
  ],
};

const eResistivity: Category = {
  id: "electric-resistivity", name: "Electric Resistivity", description: "Ω·m, Ω·cm, Ω·in.",
  group: "electricity", baseUnit: "ohmm",
  units: [
    u("ohmm", "Ohm·meter", "Ω·m", 1),
    u("ohmcm", "Ohm·centimeter", "Ω·cm", 0.01),
    u("ohmin", "Ohm·inch", "Ω·in", 0.0254),
  ],
};

const eConductance: Category = {
  id: "electric-conductance", name: "Electric Conductance", description: "Siemens, mho.",
  group: "electricity", baseUnit: "S",
  units: [
    u("S", "Siemens", "S", 1),
    u("mS", "Millisiemens", "mS", 1e-3),
    u("uS", "Microsiemens", "µS", 1e-6),
    u("mho", "Mho", "℧", 1),
  ],
};

const eConductivity: Category = {
  id: "electric-conductivity", name: "Electric Conductivity", description: "S/m, S/cm.",
  group: "electricity", baseUnit: "Sm",
  units: [
    u("Sm", "Siemens/meter", "S/m", 1),
    u("Scm", "Siemens/centimeter", "S/cm", 100),
    u("mSm", "Millisiemens/meter", "mS/m", 1e-3),
  ],
};

const capacitance: Category = {
  id: "capacitance", name: "Electrostatic Capacitance", description: "Farad, microfarad, picofarad.",
  group: "electricity", baseUnit: "F",
  units: [
    u("F", "Farad", "F", 1),
    u("mF", "Millifarad", "mF", 1e-3),
    u("uF", "Microfarad", "µF", 1e-6),
    u("nF", "Nanofarad", "nF", 1e-9),
    u("pF", "Picofarad", "pF", 1e-12),
  ],
};

const inductance: Category = {
  id: "inductance", name: "Inductance", description: "Henry, millihenry, microhenry.",
  group: "electricity", baseUnit: "H",
  units: [
    u("H", "Henry", "H", 1),
    u("mH", "Millihenry", "mH", 1e-3),
    u("uH", "Microhenry", "µH", 1e-6),
    u("nH", "Nanohenry", "nH", 1e-9),
  ],
};

// ===== Magnetism =====
const mmf: Category = {
  id: "magnetomotive-force", name: "Magnetomotive Force", description: "Ampere-turn, gilbert.",
  group: "magnetism", baseUnit: "At",
  units: [
    u("At", "Ampere-turn", "At", 1),
    u("kAt", "Kiloampere-turn", "kAt", 1000),
    u("Gb", "Gilbert", "Gb", 0.795775),
  ],
};

const magneticFieldStrength: Category = {
  id: "magnetic-field-strength", name: "Magnetic Field Strength", description: "A/m, oersted.",
  group: "magnetism", baseUnit: "Am",
  units: [
    u("Am", "Ampere/meter", "A/m", 1),
    u("Acm", "Ampere/centimeter", "A/cm", 100),
    u("Oe", "Oersted", "Oe", 79.5775),
  ],
};

const magneticFlux: Category = {
  id: "magnetic-flux", name: "Magnetic Flux", description: "Weber, maxwell.",
  group: "magnetism", baseUnit: "Wb",
  units: [
    u("Wb", "Weber", "Wb", 1),
    u("mWb", "Milliweber", "mWb", 1e-3),
    u("uWb", "Microweber", "µWb", 1e-6),
    u("Mx", "Maxwell", "Mx", 1e-8),
  ],
};

const magneticFluxDensity: Category = {
  id: "magnetic-flux-density", name: "Magnetic Flux Density", description: "Tesla, gauss.",
  group: "magnetism", baseUnit: "T",
  units: [
    u("T", "Tesla", "T", 1),
    u("mT", "Millitesla", "mT", 1e-3),
    u("uT", "Microtesla", "µT", 1e-6),
    u("G", "Gauss", "G", 1e-4),
    u("mG", "Milligauss", "mG", 1e-7),
  ],
};

// ===== Radiology =====
const radiation: Category = {
  id: "radiation", name: "Radiation Dose Equivalent", description: "Sievert, rem.",
  group: "radiology", baseUnit: "Sv",
  units: [
    u("Sv", "Sievert", "Sv", 1),
    u("mSv", "Millisievert", "mSv", 1e-3),
    u("uSv", "Microsievert", "µSv", 1e-6),
    u("rem", "Rem", "rem", 0.01),
    u("mrem", "Millirem", "mrem", 1e-5),
  ],
};

const radiationActivity: Category = {
  id: "radiation-activity", name: "Radiation Activity", description: "Becquerel, curie.",
  group: "radiology", baseUnit: "Bq",
  units: [
    u("Bq", "Becquerel", "Bq", 1),
    u("kBq", "Kilobecquerel", "kBq", 1000),
    u("MBq", "Megabecquerel", "MBq", 1e6),
    u("GBq", "Gigabecquerel", "GBq", 1e9),
    u("Ci", "Curie", "Ci", 3.7e10),
    u("mCi", "Millicurie", "mCi", 3.7e7),
    u("uCi", "Microcurie", "µCi", 3.7e4),
  ],
};

const radiationExposure: Category = {
  id: "radiation-exposure", name: "Radiation Exposure", description: "Coulomb/kg, roentgen.",
  group: "radiology", baseUnit: "Ckg",
  units: [
    u("Ckg", "Coulomb/kilogram", "C/kg", 1),
    u("mCkg", "Millicoulomb/kilogram", "mC/kg", 1e-3),
    u("R", "Roentgen", "R", 2.58e-4),
  ],
};

const radiationAbsorbed: Category = {
  id: "radiation-absorbed-dose", name: "Radiation Absorbed Dose", description: "Gray, rad.",
  group: "radiology", baseUnit: "Gy",
  units: [
    u("Gy", "Gray", "Gy", 1),
    u("mGy", "Milligray", "mGy", 1e-3),
    u("uGy", "Microgray", "µGy", 1e-6),
    u("rad", "Rad", "rad", 0.01),
    u("mrad", "Millirad", "mrad", 1e-5),
  ],
};

// ===== Other =====
const prefixes: Category = {
  id: "prefixes", name: "SI Prefixes", description: "Kilo, mega, giga, milli, micro and more.",
  group: "other", baseUnit: "one",
  units: [
    u("one", "One", "1", 1),
    u("deca", "Deca", "da", 10),
    u("hecto", "Hecto", "h", 100),
    u("kilo", "Kilo", "k", 1e3),
    u("mega", "Mega", "M", 1e6),
    u("giga", "Giga", "G", 1e9),
    u("tera", "Tera", "T", 1e12),
    u("peta", "Peta", "P", 1e15),
    u("exa", "Exa", "E", 1e18),
    u("deci", "Deci", "d", 0.1),
    u("centi", "Centi", "c", 0.01),
    u("milli", "Milli", "m", 1e-3),
    u("micro", "Micro", "µ", 1e-6),
    u("nano", "Nano", "n", 1e-9),
    u("pico", "Pico", "p", 1e-12),
    u("femto", "Femto", "f", 1e-15),
    u("atto", "Atto", "a", 1e-18),
  ],
};

const dataTransfer: Category = {
  id: "data-transfer", name: "Data Transfer", description: "bit/s, kbps, Mbps, Gbps.",
  group: "other", baseUnit: "bps",
  units: [
    u("bps", "Bit/second", "bit/s", 1),
    u("kbps", "Kilobit/second", "kbit/s", 1e3),
    u("Mbps", "Megabit/second", "Mbit/s", 1e6),
    u("Gbps", "Gigabit/second", "Gbit/s", 1e9),
    u("Tbps", "Terabit/second", "Tbit/s", 1e12),
    u("Bps", "Byte/second", "B/s", 8),
    u("KBps", "Kilobyte/second", "KB/s", 8e3),
    u("MBps", "Megabyte/second", "MB/s", 8e6),
    u("GBps", "Gigabyte/second", "GB/s", 8e9),
    u("Kibps", "Kibibit/second", "Kibit/s", 1024),
    u("Mibps", "Mebibit/second", "Mibit/s", 1024 ** 2),
  ],
};

const typography: Category = {
  id: "typography", name: "Typography", description: "Points, picas, twips, pixels.",
  group: "other", baseUnit: "m",
  units: [
    u("m", "Meter", "m", 1),
    u("cm", "Centimeter", "cm", 0.01),
    u("mm", "Millimeter", "mm", 0.001),
    u("in", "Inch", "in", 0.0254),
    u("pt", "Point", "pt", 0.0254 / 72),
    u("pica", "Pica", "pc", 0.0254 / 6),
    u("twip", "Twip", "twip", 0.0254 / 1440),
    u("px96", "Pixel (96 DPI)", "px", 0.0254 / 96),
  ],
};

const volumeLumber: Category = {
  id: "volume-lumber", name: "Volume — Lumber", description: "Board feet, cubic meter, cord.",
  group: "other", baseUnit: "m3",
  units: [
    u("m3", "Cubic meter", "m³", 1),
    u("ft3", "Cubic foot", "ft³", 0.028316846592),
    u("in3", "Cubic inch", "in³", 1.6387064e-5),
    u("bf", "Board foot", "FBM", 0.002359737216),
    u("mbf", "Thousand board feet", "MBF", 2.359737216),
    u("cord", "Cord", "cord", 3.6245563638),
    u("cordft", "Cord foot", "cord-ft", 0.4530695455),
    u("cunit", "Cunit", "cu", 2.8316846592),
  ],
};

const volumeDry: Category = {
  id: "volume-dry", name: "Volume — Dry", description: "Dry pint, dry quart, peck, bushel.",
  group: "other", baseUnit: "L",
  units: [
    u("L", "Liter", "L", 1),
    u("dpt_us", "US Dry Pint", "dry pt", 0.5506104714),
    u("dqt_us", "US Dry Quart", "dry qt", 1.1012209428),
    u("dgal_us", "US Dry Gallon", "dry gal", 4.4048837712),
    u("peck_us", "US Peck", "pk", 8.8097675424),
    u("bushel_us", "US Bushel", "bu", 35.2390701696),
    u("peck_uk", "UK Peck", "pk (UK)", 9.09218),
    u("bushel_uk", "UK Bushel", "bu (UK)", 36.36872),
  ],
};

export const CATEGORIES: Category[] = [
  length, weight, temperature, volume, area, pressure, energy, power, force,
  time, speed, angle, fuel, data, frequency, density, acceleration, torque,
  current, voltage, resistance, flow,
  // Engineering
  velocityAngular, accelerationAngular, specificVolume, momentOfInertia, momentOfForce,
  // Heat
  fuelEffMass, fuelEffVolume, tempInterval, thermalExpansion, thermalResistance,
  thermalConductivity, specificHeat, heatDensity, heatFluxDensity, heatTransferCoef,
  // Fluids
  flowMass, flowMolar, massFluxDensity, concentrationMolar, concentrationSolution,
  viscosityDynamic, viscosityKinematic, surfaceTension, permeability,
  // Light
  luminance, luminousIntensity, illumination, dpi,
  // Electricity
  charge, linearChargeDensity, surfaceChargeDensity, volumeChargeDensity,
  linearCurrentDensity, surfaceCurrentDensity, eFieldStrength, eResistivity,
  eConductance, eConductivity, capacitance, inductance,
  // Magnetism
  mmf, magneticFieldStrength, magneticFlux, magneticFluxDensity,
  // Radiology
  radiation, radiationActivity, radiationExposure, radiationAbsorbed,
  // Other
  prefixes, dataTransfer, typography, volumeLumber, volumeDry,
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

export function convert(category: Category, value: number, fromId: string, toId: string): number {
  const from = category.units.find((x) => x.id === fromId);
  const to = category.units.find((x) => x.id === toId);
  if (!from || !to) return NaN;
  return to.fromBase(from.toBase(value));
}

export function formatResult(v: number): string {
  if (!isFinite(v) || isNaN(v)) return "—";
  const abs = Math.abs(v);
  if (abs === 0) return "0";
  if (abs < 1e-4 || abs >= 1e15) return v.toExponential(6);
  // adaptive significant digits
  const digits = abs >= 1 ? Math.min(8, 10 - Math.floor(Math.log10(abs))) : 8;
  return Number(v.toPrecision(digits)).toString();
}
