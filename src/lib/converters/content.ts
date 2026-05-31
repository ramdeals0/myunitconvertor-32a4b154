import type { CategoryGroup } from "./types";

export const GROUP_SCENARIOS: Record<CategoryGroup, string[]> = {
  common: [
    "Planning international travel — converting distances, fuel volumes, or temperatures between metric and imperial systems.",
    "Cooking and baking from foreign recipes that use unfamiliar units of weight, volume, or oven temperature.",
    "DIY and home improvement projects requiring quick conversion between feet, meters, inches, and centimeters.",
    "Shipping and logistics where package dimensions and weights must match carrier-specific unit requirements.",
  ],
  engineering: [
    "Mechanical and civil engineering calculations involving force, pressure, torque, and stress across SI and US units.",
    "Manufacturing tolerance checks where drawings switch between millimeters, microns, and thousandths of an inch.",
    "Structural load analysis converting between kilonewtons, pounds-force, and kilograms-force.",
    "Cross-border project coordination where contractors and suppliers report measurements in different unit systems.",
  ],
  heat: [
    "HVAC system design converting BTU/hr to kilowatts when sizing heaters, chillers, and air conditioners.",
    "Cooking, brewing, and laboratory work translating Celsius, Fahrenheit, and Kelvin readings.",
    "Thermodynamics homework or research requiring consistent units for energy, heat flux, and specific heat.",
    "Industrial process control comparing sensor outputs reported in different temperature or heat-transfer units.",
  ],
  fluids: [
    "Plumbing and irrigation sizing converting gallons per minute to liters per second or cubic meters per hour.",
    "Automotive and aerospace fuel-flow analysis switching between mass-flow and volume-flow units.",
    "Laboratory dosing and dilution work translating microliters, milliliters, fluid ounces, and cups.",
    "Oil and gas operations where barrels, cubic feet, and cubic meters must be reconciled for reporting.",
  ],
  light: [
    "Photography and videography matching lux, foot-candles, and lumens when planning a lighting setup.",
    "Architectural lighting design checking illuminance levels against building codes written in different units.",
    "Astronomy and physics problems involving luminous flux, intensity, and radiance.",
    "Stage and studio production translating fixture specs between manufacturers using different unit conventions.",
  ],
  electricity: [
    "Electrical engineering coursework converting between volts, amperes, ohms, watts, and their SI multiples.",
    "Battery and solar sizing translating watt-hours, amp-hours, and joules for system capacity planning.",
    "Power quality analysis comparing readings in kilovolt-amperes, kilowatts, and reactive units.",
    "Cross-region equipment specification where datasheets mix SI, CGS, and legacy electrical units.",
  ],
  magnetism: [
    "Physics and materials science converting tesla, gauss, weber, and maxwell when characterizing magnets.",
    "MRI and NDT engineering checking field-strength specifications across unit systems.",
    "Motor and transformer design translating magnetic flux density between SI and CGS conventions.",
    "Academic research reproducing legacy experiments documented in non-SI magnetic units.",
  ],
  radiology: [
    "Radiation protection translating sievert, rem, gray, and rad when interpreting exposure reports.",
    "Medical imaging and oncology converting dose units across regional regulatory standards.",
    "Nuclear engineering coursework switching between becquerel, curie, and disintegrations per second.",
    "Environmental monitoring comparing measurements from instruments calibrated in different unit systems.",
  ],
  other: [
    "Specialized scientific and engineering workflows that require precise, repeatable unit conversion.",
    "Cross-disciplinary research where source data arrives in inconsistent units.",
    "Education and tutoring use cases that benefit from worked examples and reference tables.",
    "Quick reference during fieldwork, lab work, or on-site inspections.",
  ],
};
