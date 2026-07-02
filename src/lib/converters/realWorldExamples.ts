import type { Category } from "./types";
import { convert, formatResult } from "./data";

/**
 * Real-world anchors per category, expressed in the category's base unit.
 * Rendered on every pair page as concrete, relatable examples.
 * Values are widely-cited references (Wikipedia, NIST, standards bodies).
 */
const ANCHORS: Record<string, Array<{ label: string; base: number }>> = {
  length: [
    { label: "Height of a standard doorway", base: 2.032 },
    { label: "Length of a US dollar bill", base: 0.15595 },
    { label: "A marathon", base: 42195 },
    { label: "Diameter of a basketball", base: 0.239 },
    { label: "Height of the Eiffel Tower", base: 330 },
    { label: "London to New York (great-circle)", base: 5570000 },
  ],
  weight: [
    { label: "A US quarter coin", base: 0.00567 },
    { label: "A liter of water", base: 1 },
    { label: "An adult house cat", base: 4.5 },
    { label: "A gold bar (Good Delivery)", base: 12.4 },
    { label: "An average adult human", base: 70 },
    { label: "A small car (Honda Civic)", base: 1350 },
  ],
  temperature: [
    { label: "Water freezes", base: 0 },
    { label: "Comfortable room temperature", base: 20 },
    { label: "Human body temperature", base: 37 },
    { label: "Water boils (sea level)", base: 100 },
    { label: "Oven — baking bread", base: 190 },
    { label: "Surface of Venus", base: 462 },
  ],

  volume: [
    { label: "A tablespoon", base: 0.01478676 },
    { label: "A standard wine bottle", base: 0.75 },
    { label: "A gallon of milk", base: 3.785411784 },
    { label: "A bathtub (average)", base: 302 },
    { label: "Backyard swimming pool", base: 25000 },
    { label: "Olympic swimming pool", base: 2500000 },
  ],
  area: [
    { label: "A credit card", base: 0.005486 },
    { label: "A US king-size mattress", base: 4.03 },
    { label: "A tennis court (singles)", base: 195.7 },
    { label: "An American football field", base: 5351 },
    { label: "Central Park, New York", base: 3410000 },
    { label: "Country of Luxembourg", base: 2586000000 },
  ],
  speed: [
    { label: "Average walking pace", base: 1.4 },
    { label: "Usain Bolt (100 m record)", base: 10.44 },
    { label: "Highway driving (65 mph)", base: 29.06 },
    { label: "Commercial jet cruise", base: 250 },
    { label: "Speed of sound (sea level)", base: 343 },
    { label: "Speed of light", base: 299792458 },
  ],
  pressure: [
    { label: "Atmospheric pressure at sea level", base: 101325 },
    { label: "Car tire (32 psi)", base: 220632 },
    { label: "Espresso machine extraction (9 bar)", base: 900000 },
    { label: "Bicycle road tire (100 psi)", base: 689476 },
    { label: "Deep ocean at 1 km", base: 10100000 },
    { label: "Diamond anvil cell (record)", base: 7.7e11 },
  ],
  energy: [
    { label: "A running toaster for 1 second", base: 1000 },
    { label: "A slice of bread", base: 335000 },
    { label: "A Big Mac", base: 2320000 },
    { label: "1 kWh of electricity", base: 3600000 },
    { label: "A gallon of gasoline", base: 121000000 },
    { label: "Hiroshima atomic bomb", base: 6.3e13 },
  ],
  power: [
    { label: "An LED lightbulb", base: 10 },
    { label: "A human resting metabolic rate", base: 100 },
    { label: "A microwave oven", base: 1100 },
    { label: "A compact car engine", base: 90000 },
    { label: "A Formula 1 engine", base: 750000 },
    { label: "A wind turbine (offshore)", base: 8000000 },
  ],
  time: [
    { label: "A human heartbeat", base: 0.83 },
    { label: "A commercial break", base: 30 },
    { label: "A feature film", base: 6600 },
    { label: "One workday", base: 28800 },
    { label: "A calendar year", base: 31557600 },
    { label: "Age of the universe", base: 4.35e17 },
  ],
  force: [
    { label: "Weight of an apple", base: 1 },
    { label: "A firm handshake", base: 100 },
    { label: "A 90 kg person's weight", base: 883 },
    { label: "A car's braking force (1 g)", base: 13000 },
    { label: "A Saturn V rocket at liftoff", base: 34000000 },
  ],
  torque: [
    { label: "Hand-tightening a jar lid", base: 2 },
    { label: "Bicycle pedal push", base: 20 },
    { label: "Car lug nut spec", base: 130 },
    { label: "Ford F-150 diesel peak", base: 610 },
    { label: "Large ship diesel engine", base: 7600000 },
  ],
  angle: [
    { label: "A clock's second hand each tick", base: 0.1047 },
    { label: "A right angle", base: 1.5708 },
    { label: "Interior angle of an equilateral triangle", base: 1.0472 },
    { label: "A full turn", base: 6.2832 },
  ],
  frequency: [
    { label: "Musical note A above middle C", base: 440 },
    { label: "Human hearing upper limit", base: 20000 },
    { label: "FM radio (mid-band)", base: 100000000 },
    { label: "Wi-Fi 5 GHz", base: 5e9 },
    { label: "Modern CPU clock", base: 4e9 },
  ],
  density: [
    { label: "Air at sea level", base: 1.225 },
    { label: "Water at 4 °C", base: 1000 },
    { label: "Aluminum", base: 2700 },
    { label: "Iron", base: 7874 },
    { label: "Lead", base: 11340 },
    { label: "Gold", base: 19320 },
  ],
  data: [
    { label: "A plain-text email", base: 20000 },
    { label: "A high-res photo", base: 5000000 },
    { label: "An MP3 song", base: 5000000 },
    { label: "An HD movie (1080p)", base: 4000000000 },
    { label: "A 4K Blu-ray disc", base: 100000000000 },
  ],
  fuel: [
    { label: "Modern compact car (highway)", base: 5.5 }, // L/100km base? fuel base is L/100km
    { label: "Full-size SUV", base: 12 },
    { label: "Hybrid sedan", base: 4.5 },
    { label: "Sports car", base: 15 },
  ],
  acceleration: [
    { label: "Gravity (1 g)", base: 9.80665 },
    { label: "Family car 0–100 km/h", base: 3 },
    { label: "Sports car 0–100 km/h", base: 9 },
    { label: "Passenger elevator", base: 1 },
    { label: "Fighter jet ejection seat", base: 147 },
  ],
  "sound-level": [
    { label: "A whisper", base: 30 },
    { label: "Normal conversation", base: 60 },
    { label: "Busy city traffic", base: 85 },
    { label: "Rock concert front row", base: 110 },
    { label: "Jet engine at 30 m", base: 140 },
  ],
  "radiation-equivalent-dose": [
    { label: "Dental X-ray", base: 5e-6 },
    { label: "Chest X-ray", base: 1e-4 },
    { label: "Annual natural background", base: 3e-3 },
    { label: "Head CT scan", base: 2e-3 },
    { label: "Astronaut / 6-month ISS mission", base: 8e-2 },
  ],
  "luminous-flux": [
    { label: "A single candle", base: 12 },
    { label: "40 W incandescent bulb", base: 450 },
    { label: "100 W incandescent bulb", base: 1600 },
    { label: "Bright office lighting per fixture", base: 3000 },
  ],
  current: [
    { label: "A phone charger", base: 1 },
    { label: "A household LED bulb", base: 0.08 },
    { label: "A US wall outlet (max)", base: 15 },
    { label: "An arc welder", base: 200 },
  ],
  voltage: [
    { label: "AA battery", base: 1.5 },
    { label: "USB port", base: 5 },
    { label: "Car battery", base: 12 },
    { label: "US wall outlet", base: 120 },
    { label: "EU wall outlet", base: 230 },
    { label: "High-voltage transmission line", base: 500000 },
  ],
};

export interface RealWorldExample {
  label: string;
  fromValue: number;
  toValue: number;
}

/**
 * Compute up to `max` real-world examples for a pair. Falls back to a
 * generic reference-quantity list when no category anchors exist.
 */
export function getRealWorldExamples(
  category: Category,
  fromId: string,
  toId: string,
  max = 5,
): RealWorldExample[] {
  const anchors = ANCHORS[category.id];
  if (!anchors?.length) return [];
  return anchors.slice(0, max).map((a) => {
    // convert base → from and base → to using the base unit id
    const fromValue = convert(category, a.base, category.baseUnit, fromId);
    const toValue = convert(category, a.base, category.baseUnit, toId);
    return { label: a.label, fromValue, toValue };
  });
}

export function formatExampleValue(v: number, symbol: string): string {
  return `${formatResult(v)} ${symbol}`;
}
