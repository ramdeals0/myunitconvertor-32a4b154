import type { Category } from "./types";

export interface CategoryFAQ {
  q: string;
  a: string;
}

export interface RelatedConverter {
  /** category id */
  id: string;
  /** short label to display */
  label: string;
  /** why it's related (one line) */
  reason: string;
}

export interface CategoryContent {
  /** 2–3 paragraphs of unique prose. Each string is one paragraph. */
  intro: string[];
  /** 5–7 FAQ items unique to this category. */
  faqs: CategoryFAQ[];
  /** Suggested cross-category converters, curated. */
  related: RelatedConverter[];
}

/* -------------------------------------------------------------------------- */
/*  Hand-authored content for high-traffic categories                          */
/* -------------------------------------------------------------------------- */

const CONTENT: Record<string, CategoryContent> = {
  length: {
    intro: [
      "Length is the most-converted quantity on the web: meters, centimeters, millimeters, feet, inches, yards, miles and their nautical and astronomical cousins all describe the same underlying dimension. Every conversion here is exact — the international inch is defined as exactly 0.0254 m and the international foot as exactly 0.3048 m, so results carry full 12-digit precision instead of rounded classroom shortcuts.",
      "Whether you're translating a European product datasheet from millimeters to inches, sizing a rug in feet after seeing centimeters online, or converting parsecs for an astrophysics assignment, the same converter handles it. Use the popular pair cards below to jump straight to the pages people actually search for — cm to inches, mm to inches, m to feet — each with formulas, worked examples and reference tables.",
    ],
    faqs: [
      { q: "How many centimeters are in an inch?", a: "Exactly 2.54 centimeters. The inch is defined by international agreement as 0.0254 meters, which makes 1 in = 2.54 cm an exact conversion, not an approximation." },
      { q: "How many feet are in a meter?", a: "One meter equals approximately 3.280839895 feet. The relationship is exact: 1 ft = 0.3048 m, so 1 m = 1 / 0.3048 ft." },
      { q: "What is the difference between a statute mile and a nautical mile?", a: "A statute (land) mile is 1,609.344 m, while a nautical mile — used in aviation and maritime navigation — is 1,852 m, or one minute of latitude." },
      { q: "Are US and Imperial length units the same?", a: "For length, yes: the US Customary and Imperial systems both use the international inch, foot, yard and mile with identical definitions. Volume and weight units are where the two systems diverge." },
      { q: "How precise are the conversions?", a: "Constants follow NIST Special Publication 811 with 12-digit internal precision. Displayed results are rounded for readability but calculations stay exact end-to-end." },
    ],
    related: [
      { id: "area", label: "Area", reason: "Length squared — square meters, square feet, acres." },
      { id: "volume", label: "Volume", reason: "Length cubed — liters, gallons, cubic feet." },
      { id: "speed", label: "Speed", reason: "Distance per time — mph, km/h, m/s." },
    ],
  },

  weight: {
    intro: [
      "Weight (technically mass) is the second most-searched conversion category, dominated by kilograms ↔ pounds and grams ↔ ounces. The kilogram is defined via the Planck constant and every derived unit here — pound (0.45359237 kg exactly), ounce (1/16 lb), stone, tonne, grain — inherits that precision.",
      "Recipe writers, shipping clerks, fitness apps and lab technicians all live in this converter. Pick a popular pair below for lbs to kg, kg to lbs, oz to grams or grams to oz, or use the full unit table to compare tonnes, short tons, long tons and troy ounces side by side.",
    ],
    faqs: [
      { q: "How many pounds are in a kilogram?", a: "One kilogram equals 2.20462262185 pounds. The pound is defined as exactly 0.45359237 kg, so the reciprocal gives the pounds-per-kilogram value." },
      { q: "What's the difference between an ounce and a troy ounce?", a: "An avoirdupois ounce (used for food and everyday goods) is 28.349523125 g. A troy ounce, used for precious metals, is 31.1034768 g — about 10% heavier." },
      { q: "Is a metric ton the same as a US ton?", a: "No. A metric ton (tonne) is 1,000 kg. A US short ton is 907.18474 kg and a UK long ton is 1,016.0469088 kg." },
      { q: "How many grams are in a pound?", a: "Exactly 453.59237 grams, by international definition." },
      { q: "Do the converter results account for gravity?", a: "No — this tool converts mass, not gravitational force. To convert a weight force (like pounds-force or newtons) use the Force converter." },
    ],
    related: [
      { id: "force", label: "Force", reason: "Weight-force in newtons, pounds-force, kilograms-force." },
      { id: "density", label: "Density", reason: "Mass per volume — kg/m³, g/cm³, lb/ft³." },
      { id: "flow-mass", label: "Mass Flow", reason: "Mass per time — kg/s, kg/h, lb/h." },
    ],
  },

  temperature: {
    intro: [
      "Temperature conversions are unique because they involve both a scale factor and an offset — you can't just multiply. Celsius, Fahrenheit, Kelvin and Rankine each anchor to different zero points, so the converter applies the full affine transformation (°F = °C × 9/5 + 32, K = °C + 273.15, and so on) with 12-digit accuracy.",
      "The tool is used for weather, cooking, chemistry, industrial process control and space-flight-grade thermodynamics alike. Kelvin and Rankine are absolute scales useful in gas-law and radiation calculations; Celsius and Fahrenheit are the everyday scales. Pick a pair below or type any value into the converter above.",
    ],
    faqs: [
      { q: "How do I convert Celsius to Fahrenheit?", a: "Multiply the Celsius value by 9/5 and add 32. For example, 20 °C × 9/5 + 32 = 68 °F." },
      { q: "What is 0 K in Celsius?", a: "0 K = −273.15 °C. This is absolute zero, the theoretical lowest possible temperature." },
      { q: "Why is 40 the only number where Celsius and Fahrenheit meet?", a: "The scales cross at −40°: −40 °C = −40 °F. It's a consequence of the linear formula having a single fixed point." },
      { q: "When should I use Kelvin instead of Celsius?", a: "Use Kelvin for any calculation involving absolute temperature — ideal gas law, Stefan-Boltzmann radiation, thermodynamic efficiency — where negative values would be meaningless." },
      { q: "What is Rankine used for?", a: "The Rankine scale is Fahrenheit's absolute counterpart (0 °R = absolute zero). It's still used in some US engineering fields, especially aerospace thermodynamics." },
    ],
    related: [
      { id: "temperature-interval", label: "Temperature Interval", reason: "Differences in temperature (ΔK, Δ°C, Δ°F)." },
      { id: "energy", label: "Energy", reason: "Heat as energy — joules, calories, BTU." },
      { id: "thermal-conductivity", label: "Thermal Conductivity", reason: "How well materials conduct heat." },
    ],
  },

  volume: {
    intro: [
      "Volume conversions carry a well-known pitfall: US and Imperial gallons, quarts, pints and fluid ounces are not the same size. A US gallon is 3.785411784 L; an Imperial gallon is 4.54609 L — a 20% difference. This converter keeps the two systems separated with explicit labels and exact factors, so recipes, fuel calculations and lab work stay consistent.",
      "Everyday users convert cups to milliliters, fluid ounces to milliliters and liters to gallons; engineers reach for cubic meters, barrels and acre-feet. The full unit table below lets you compare all supported measures against one liter, and the popular pair grid links out to dedicated pages for the highest-traffic conversions.",
    ],
    faqs: [
      { q: "How many milliliters in a US fluid ounce?", a: "1 US fl oz = 29.5735295625 mL. The Imperial fluid ounce is different — 28.4130625 mL." },
      { q: "Is a US gallon the same as an Imperial gallon?", a: "No. A US liquid gallon is 3.785411784 L; an Imperial (UK) gallon is 4.54609 L. Always check which system a recipe or spec uses." },
      { q: "How many cups are in a liter?", a: "About 4.2268 US customary cups, or exactly 4 metric cups (250 mL each)." },
      { q: "What's a barrel of oil in liters?", a: "One petroleum barrel = 158.987294928 L, or 42 US gallons." },
      { q: "How do dry and liquid volumes differ?", a: "US dry pints, quarts and gallons are physically larger than their liquid counterparts. For dry goods (grains, produce) use the Volume — Dry converter." },
    ],
    related: [
      { id: "length", label: "Length", reason: "Volume is length cubed." },
      { id: "flow", label: "Volumetric Flow", reason: "Volume per time — GPM, L/s, m³/h." },
      { id: "density", label: "Density", reason: "Mass per volume." },
      { id: "volume-dry", label: "Volume — Dry", reason: "Dry pints, quarts and bushels." },
    ],
  },

  area: {
    intro: [
      "Area is length squared, so every scale factor is the square of its length counterpart: 1 m² = 10.7639 ft² because 1 m ≈ 3.28084 ft and (3.28084)² ≈ 10.7639. The converter uses exact squared factors internally so hectares, acres, square miles and square kilometers agree to 12 digits.",
      "Real-estate listings, land surveys, agricultural plots, roofing estimates and floor plans all live in this converter. Popular jumps below cover square feet to square meters, acres to hectares, and square meters to square yards.",
    ],
    faqs: [
      { q: "How many square feet are in a square meter?", a: "1 m² = 10.7639104167 ft². The factor is (1 / 0.3048)²." },
      { q: "How many acres are in a hectare?", a: "1 hectare = 2.4710538147 acres. A hectare is 10,000 m²; an acre is 4,046.8564224 m²." },
      { q: "What's an acre in square feet?", a: "Exactly 43,560 square feet, by US and Imperial definition." },
      { q: "How large is a square mile?", a: "1 mi² = 640 acres = 2.589988110336 km²." },
      { q: "Are US and Imperial area units the same?", a: "Yes for the international foot-based units (ft², yd², mi², acre). Older US survey acres differ by parts per million." },
    ],
    related: [
      { id: "length", label: "Length", reason: "Underlying linear units." },
      { id: "volume", label: "Volume", reason: "Length cubed — extends 2-D area to 3-D." },
      { id: "density", label: "Density", reason: "For surface density and mass-per-area conversions." },
    ],
  },

  pressure: {
    intro: [
      "Pressure is force per area, and this category spans nine orders of magnitude — from micropascals in acoustics to megapascals in hydraulics. The SI unit is the pascal (Pa = N/m²), but the field uses bar, psi, atm, torr, mmHg, inHg and technical atmospheres depending on industry. The converter keeps all of them exact against the pascal.",
      "Tire pressure (psi ↔ bar ↔ kPa), weather (millibars ↔ inHg), medical (mmHg for blood pressure), industrial (bar, MPa) and vacuum (torr, Pa) all rely on clean conversions. Jump into the popular pairs for psi to bar, bar to psi and kPa to psi below.",
    ],
    faqs: [
      { q: "How many psi in a bar?", a: "1 bar = 14.5037737730 psi. The bar is defined as exactly 100,000 Pa." },
      { q: "What is 1 atmosphere in psi?", a: "1 standard atmosphere = 14.6959487755 psi = 101,325 Pa." },
      { q: "What's the difference between psi, psig and psia?", a: "psi is a unit; psig is gauge pressure (above atmospheric); psia is absolute pressure. The converter treats all inputs as the same numeric unit — you decide whether it's gauge or absolute." },
      { q: "How do I convert kPa to psi?", a: "Multiply kPa by 0.145037737730. So 100 kPa = 14.5037737730 psi." },
      { q: "Why do meteorologists use hPa or mb?", a: "1 hectopascal = 1 millibar = 100 Pa. Historical continuity — weather charts have used millibars for over a century." },
    ],
    related: [
      { id: "force", label: "Force", reason: "Numerator of pressure — pressure × area = force." },
      { id: "area", label: "Area", reason: "Denominator of pressure." },
      { id: "energy", label: "Energy", reason: "Pressure × volume = energy." },
      { id: "stress", label: "Stress", reason: "Mechanical stress uses the same units as pressure." },
    ],
  },

  energy: {
    intro: [
      "Energy is measured in joules in SI, but calories (food), kilowatt-hours (electricity), BTUs (heating and cooling), electronvolts (physics), foot-pounds (mechanical work) and therms (natural gas) all persist. Every unit here converts against the joule with exact factors — 1 kWh = 3,600,000 J, 1 BTU (IT) = 1,055.05585262 J, 1 cal (thermo) = 4.184 J.",
      "Utility bills, HVAC sizing, nutrition labels, physics homework and battery datasheets all speak different energy dialects. Use the popular pairs to move quickly between kWh, joules, BTU and calories.",
    ],
    faqs: [
      { q: "How many joules in a kilowatt-hour?", a: "Exactly 3,600,000 J (3.6 MJ). One watt-hour is 3,600 J." },
      { q: "How many joules in one calorie?", a: "The thermochemical calorie is exactly 4.184 J; the IT (International Table) calorie is 4.1868 J. The 'Calorie' on food labels is really a kilocalorie (1,000 cal)." },
      { q: "How many BTU in a kWh?", a: "1 kWh ≈ 3,412.14163 BTU (IT). Useful when comparing electric heaters to gas or fuel-oil systems." },
      { q: "What is an electronvolt?", a: "1 eV = 1.602176634 × 10⁻¹⁹ J, the energy an electron gains crossing a 1-volt potential. Used in atomic and particle physics." },
      { q: "How many joules in a foot-pound?", a: "1 ft·lbf = 1.3558179483 J. This is a work/energy unit — not the same as pound-foot (torque)." },
    ],
    related: [
      { id: "power", label: "Power", reason: "Energy per time — watts, horsepower, BTU/h." },
      { id: "temperature", label: "Temperature", reason: "Heat energy relates to temperature via specific heat." },
      { id: "force", label: "Force", reason: "Force × distance = work = energy." },
    ],
  },

  power: {
    intro: [
      "Power is the rate of energy transfer: 1 watt = 1 joule per second. Mechanical horsepower, electric watts, refrigeration tons and BTU/hr describe the same quantity across engineering domains. Conversions here are exact — 1 mechanical hp = 745.6998715822702 W, 1 refrigeration ton = 3,516.8528420667 W (12,000 BTU/h).",
      "Motor ratings, HVAC sizing, generator specs, solar arrays and fitness bike outputs all use this converter. Popular jumps: hp to kW, kW to hp, BTU/hr to kW.",
    ],
    faqs: [
      { q: "How many watts in one horsepower?", a: "Mechanical (imperial) horsepower = 745.6998715822702 W. Metric horsepower (PS/CV) = 735.49875 W. Always check which definition a spec uses." },
      { q: "How many BTU/hr in a kilowatt?", a: "1 kW ≈ 3,412.14163 BTU/hr (IT). Common for HVAC equipment ratings." },
      { q: "What is a 'ton' of cooling?", a: "1 refrigeration ton = 12,000 BTU/hr = 3.5168528421 kW — the rate at which one short ton of ice melts in 24 hours." },
      { q: "How does power differ from energy?", a: "Energy is a total (joules, kWh). Power is a rate (watts = joules/s). A 100 W bulb running for 10 h uses 1 kWh." },
      { q: "How many watts is a typical microwave?", a: "Common household microwaves are 700–1,200 W of cooking output. Convert to kW or BTU/hr from the popular pair grid below." },
    ],
    related: [
      { id: "energy", label: "Energy", reason: "Power integrated over time." },
      { id: "torque", label: "Torque", reason: "Rotational power = torque × angular velocity." },
      { id: "current", label: "Electric Current", reason: "P = V × I in DC circuits." },
    ],
  },

  force: {
    intro: [
      "Force is measured in newtons in SI (1 N = 1 kg·m/s²). Older unit systems use dynes (CGS), pounds-force (US Customary) and kilograms-force (metric technical). This converter carries the exact standard-gravity factor gₙ = 9.80665 m/s² for kgf and lbf conversions.",
      "Structural engineering, mechanics coursework, materials testing and physics labs all live here. The popular pairs cover N ↔ lbf, kN ↔ kip, and dyn ↔ N.",
    ],
    faqs: [
      { q: "How many newtons in a pound-force?", a: "1 lbf = 4.4482216152605 N. Derived from the pound mass × standard gravity." },
      { q: "What's the difference between pound-mass and pound-force?", a: "Pound-mass (lb) is a mass unit; pound-force (lbf) is the weight of one lb at standard gravity. On Earth they're numerically equal, but conceptually distinct." },
      { q: "How many dynes in a newton?", a: "1 N = 100,000 dyn. The dyne is the CGS unit of force, still used in surface tension and older physics texts." },
      { q: "What is a kilogram-force?", a: "1 kgf = 9.80665 N — the weight of a 1 kg mass in standard gravity. Common in older European mechanical engineering." },
      { q: "How is force related to pressure?", a: "Pressure = force / area. Use the Pressure converter when you need Pa, psi, bar and friends." },
    ],
    related: [
      { id: "weight", label: "Weight & Mass", reason: "F = m × g links mass and force." },
      { id: "pressure", label: "Pressure", reason: "Force per unit area." },
      { id: "torque", label: "Torque", reason: "Force × moment arm." },
    ],
  },

  time: {
    intro: [
      "The SI unit of time is the second, defined via the caesium-133 hyperfine transition. Every other unit here — millisecond, microsecond, minute, hour, day, week, month, year, decade — reduces to an exact number of seconds. Calendar months and years use average lengths (30.44 d and 365.25 d) so long-run conversions stay consistent.",
      "Project scheduling, physics problems, astronomy, video editing and legal timelines all reach for a time converter. Popular jumps below cover days ↔ hours, minutes ↔ seconds and years ↔ days.",
    ],
    faqs: [
      { q: "How many seconds in a day?", a: "86,400 s (24 × 60 × 60). Ignoring leap seconds, which are handled at the UTC level, not by unit conversion." },
      { q: "How many days in a year (this converter)?", a: "365.25 days — the Julian year, which averages out leap years. Use the exact 365 or 366 when you need a specific calendar year." },
      { q: "How many microseconds in a millisecond?", a: "1 ms = 1,000 µs = 1,000,000 ns." },
      { q: "What's a fortnight?", a: "Exactly 2 weeks = 14 days = 1,209,600 s. Rare in modern use outside the UK and physics jokes." },
      { q: "Is a month 30 or 31 days here?", a: "This converter uses the average calendar month of 30.4375 days for stable long-term conversions. For a specific month use its actual length." },
    ],
    related: [
      { id: "frequency", label: "Frequency", reason: "Frequency = 1 / period." },
      { id: "speed", label: "Speed", reason: "Distance per time." },
      { id: "flow", label: "Volumetric Flow", reason: "Volume per time." },
    ],
  },

  speed: {
    intro: [
      "Speed is distance over time. Everyday values live in km/h and mph; scientific work uses m/s; aviation and maritime use knots (nautical miles per hour); typing and belts sometimes use feet per second. Every conversion here is exact against m/s.",
      "Vehicle speedometers, wind speeds, treadmill pace, projectile physics and network throughput analogies all pull from this converter. Popular pairs: mph ↔ km/h, m/s ↔ km/h, knots ↔ mph.",
    ],
    faqs: [
      { q: "How many mph in a km/h?", a: "1 km/h = 0.6213711922 mph. Equivalently, 1 mph = 1.609344 km/h exactly." },
      { q: "How fast is one knot?", a: "1 knot = 1 nautical mile per hour = 1.852 km/h = 1.15077945 mph exactly." },
      { q: "How many m/s in a km/h?", a: "1 km/h = 0.277̅ m/s (5/18). To convert km/h to m/s, divide by 3.6." },
      { q: "What is Mach 1?", a: "Mach 1 is the local speed of sound, roughly 343 m/s in dry air at 20 °C. Mach conversions depend on altitude and temperature." },
      { q: "Is 60 mph really 88 fps?", a: "Yes — 60 mph × 5,280 ft/mi ÷ 3,600 s/h = 88 ft/s exactly. Useful for reaction-time and stopping-distance problems." },
    ],
    related: [
      { id: "length", label: "Length", reason: "Numerator of speed." },
      { id: "time", label: "Time", reason: "Denominator of speed." },
      { id: "acceleration", label: "Acceleration", reason: "Change in speed per time." },
      { id: "velocity-angular", label: "Angular Velocity", reason: "Rotational analogue — rad/s, rpm." },
    ],
  },

  angle: {
    intro: [
      "Angles are ratios, so the SI radian is dimensionless: 2π rad = 360° = 400 gon = 6,400 mil (NATO). This converter carries π to full double precision so degree ↔ radian round-trips lose no information.",
      "Trigonometry, navigation, surveying, machining and CAD all mix units. Popular jumps: degrees ↔ radians, arcminutes ↔ degrees, gon ↔ degrees.",
    ],
    faqs: [
      { q: "How many degrees in a radian?", a: "1 rad = 180 / π ≈ 57.2957795131 °. And 1° = π / 180 rad ≈ 0.01745329252 rad." },
      { q: "What's a gradian (gon)?", a: "A gradian divides a right angle into 100 parts, so 400 gon = 360°. Common in European surveying." },
      { q: "How many arcseconds in a degree?", a: "1° = 60' = 3,600″. Arcminutes and arcseconds are heavily used in astronomy and precise positioning." },
      { q: "What's a NATO mil?", a: "1 NATO mil = 1/6,400 of a full circle. Used in military artillery and rangefinding. Distinct from milliradian (1/6,283.19 of a circle)." },
      { q: "Should I use radians in calculators?", a: "For calculus, physics and any derivative or series of trig functions — yes, always radians. For everyday geometry, degrees are fine." },
    ],
    related: [
      { id: "velocity-angular", label: "Angular Velocity", reason: "Angle per unit time." },
      { id: "acceleration-angular", label: "Angular Acceleration", reason: "Change in angular velocity per time." },
      { id: "torque", label: "Torque", reason: "Rotational force, paired with angular motion." },
    ],
  },

  data: {
    intro: [
      "Digital storage uses two parallel unit systems that look alike but aren't equal: decimal (SI) kilobyte = 1,000 B, and binary (IEC) kibibyte (KiB) = 1,024 B. Hard-drive vendors use decimal; operating systems and RAM use binary. The converter keeps both families with exact factors so you can reconcile a '1 TB' drive that Windows reports as 931 GiB.",
      "Popular jumps below cover MB ↔ GB, GB ↔ TB, and MiB ↔ MB for people trying to explain the storage-size discrepancy.",
    ],
    faqs: [
      { q: "Is 1 GB the same as 1 GiB?", a: "No. 1 GB (SI) = 1,000,000,000 B. 1 GiB (IEC binary) = 1,073,741,824 B — about 7.4% larger." },
      { q: "Why does my 1 TB drive show as 931 GB?", a: "Drive manufacturers advertise in decimal terabytes (10¹² B). Operating systems often report in binary tebibytes (2⁴⁰ B). 1 TB ÷ 2⁴⁰ ≈ 0.9095, so 1,000 GB ≈ 931 GiB." },
      { q: "How many bytes in a bit?", a: "1 byte = 8 bits. Storage is measured in bytes; network throughput is usually measured in bits per second." },
      { q: "What's the difference between MB and Mb?", a: "MB is megabyte (10⁶ B); Mb is megabit (10⁶ b). '100 Mbps' internet is 12.5 MB/s at best, not 100 MB/s." },
      { q: "Which units should I use for RAM?", a: "RAM sizes are always powers of two, so MiB and GiB (binary) are technically correct. Manufacturers usually just write MB and GB, meaning MiB and GiB." },
    ],
    related: [
      { id: "data-transfer", label: "Data Transfer", reason: "Bandwidth — bit/s, kbps, Mbps, Gbps." },
      { id: "frequency", label: "Frequency", reason: "Clock speeds — Hz, kHz, MHz, GHz." },
      { id: "time", label: "Time", reason: "Latency and refresh intervals — ms, µs, ns." },
    ],
  },

  fuel: {
    intro: [
      "Fuel economy inverts the usual conversion pattern: liters per 100 km is 'lower is better', while mpg is 'higher is better'. The two forms are reciprocals of each other, scaled by unit constants — so US mpg and UK mpg (which use different gallons) give different numbers for the same car.",
      "Popular jumps: mpg (US) ↔ L/100 km, mpg (UK) ↔ L/100 km, km/L ↔ mpg.",
    ],
    faqs: [
      { q: "How do I convert mpg to L/100 km?", a: "For US mpg: L/100 km = 235.214583 / mpg. For UK mpg: L/100 km = 282.480936 / mpg. The constant differs because US and UK gallons differ." },
      { q: "Why is US mpg lower than UK mpg for the same car?", a: "A UK gallon (4.54609 L) is 20% larger than a US gallon (3.78541 L), so a car travels 20% more miles per UK gallon of the same fuel." },
      { q: "Is km/L the same as mpg?", a: "No — km/L is used in some Asian markets and is a direct 'distance per volume' figure. 1 mpg (US) = 0.4251437 km/L." },
      { q: "What's a good L/100 km value?", a: "Modern efficient cars: 5–7 L/100 km. Hybrids: 3–5. SUVs and trucks: 10–15." },
      { q: "Do these numbers apply to EVs?", a: "For EVs, energy per distance (Wh/km or kWh/100 km) is used instead of fuel volume. Convert those in the Energy category." },
    ],
    related: [
      { id: "volume", label: "Volume", reason: "Underlying fuel-volume units." },
      { id: "length", label: "Length", reason: "Underlying distance units." },
      { id: "energy", label: "Energy", reason: "For EV Wh/km and MJ/km." },
    ],
  },

  frequency: {
    intro: [
      "Frequency is the number of cycles per second: 1 hertz = 1 cycle/s. Radio, audio, clock speeds, mechanical vibration and biological rhythms all use this converter. Multiples run from millihertz (tidal cycles) to terahertz (infrared light).",
      "Popular jumps: Hz ↔ kHz ↔ MHz ↔ GHz, plus rpm ↔ Hz for rotating machinery.",
    ],
    faqs: [
      { q: "How many Hz in a kHz?", a: "1 kHz = 1,000 Hz. 1 MHz = 1,000,000 Hz. 1 GHz = 1,000,000,000 Hz." },
      { q: "How do I convert rpm to Hz?", a: "Divide rpm by 60. So 3,000 rpm = 50 Hz (one revolution is one 'cycle')." },
      { q: "What's the human hearing range?", a: "Roughly 20 Hz to 20 kHz for young adults, narrowing with age." },
      { q: "What frequency is Wi-Fi?", a: "Consumer Wi-Fi uses 2.4 GHz, 5 GHz and 6 GHz bands (Wi-Fi 6E and 7)." },
      { q: "Is frequency the same as angular frequency?", a: "No. Ordinary frequency f is in Hz. Angular frequency ω = 2πf is in rad/s. Use the Angular Velocity converter for ω." },
    ],
    related: [
      { id: "time", label: "Time", reason: "Period = 1 / frequency." },
      { id: "velocity-angular", label: "Angular Velocity", reason: "ω = 2πf." },
      { id: "data-transfer", label: "Data Transfer", reason: "Symbol rates and clock frequencies." },
    ],
  },

  density: {
    intro: [
      "Density is mass per unit volume: kg/m³ in SI, g/cm³ in chemistry, lb/ft³ and lb/in³ in engineering. Water at 4 °C is the classic reference at 1,000 kg/m³. This converter keeps every unit exact against kg/m³.",
      "Popular jumps: kg/m³ ↔ g/cm³, lb/ft³ ↔ kg/m³, g/mL ↔ lb/gal.",
    ],
    faqs: [
      { q: "How many kg/m³ in 1 g/cm³?", a: "Exactly 1,000. 1 g/cm³ = 1,000 kg/m³ = 1 kg/L." },
      { q: "What's the density of water?", a: "Pure water at 4 °C is 999.972 kg/m³, commonly rounded to 1,000 kg/m³." },
      { q: "How many lb/ft³ in 1 kg/m³?", a: "1 kg/m³ = 0.06242796058 lb/ft³. Equivalently, 1 lb/ft³ = 16.0184633739 kg/m³." },
      { q: "What's specific gravity?", a: "The dimensionless ratio of a substance's density to water's density (at 4 °C). Numerically equal to density in g/cm³." },
      { q: "How do I convert API gravity to density?", a: "SG = 141.5 / (131.5 + °API); then density = SG × 999.972 kg/m³. API is a petroleum-industry inverted density scale." },
    ],
    related: [
      { id: "weight", label: "Weight & Mass", reason: "Numerator of density." },
      { id: "volume", label: "Volume", reason: "Denominator of density." },
      { id: "concentration-solution", label: "Solution Concentration", reason: "Mass of solute per volume of solution." },
    ],
  },

  acceleration: {
    intro: [
      "Acceleration is the rate of change of velocity: SI unit m/s². Automotive tests use g's (1 g = 9.80665 m/s²), some engineering fields still use ft/s², and Galileo (Gal) shows up in geophysics for gravity anomalies.",
      "Popular jumps: m/s² ↔ g, ft/s² ↔ m/s², Gal ↔ m/s².",
    ],
    faqs: [
      { q: "What is 1 g in m/s²?", a: "Standard gravity gₙ = 9.80665 m/s² exactly. A '2 g' turn means twice that." },
      { q: "How many m/s² in ft/s²?", a: "1 ft/s² = 0.3048 m/s². So Earth's gravity ≈ 32.1740 ft/s²." },
      { q: "What's a Gal?", a: "1 Gal = 1 cm/s² = 0.01 m/s². Used in gravimetry; a milligal (mGal) is a common gravity-anomaly unit." },
      { q: "How much acceleration does a car produce?", a: "0–60 mph in 6 s ≈ 4.47 m/s² ≈ 0.456 g. Sports cars and EVs can exceed 1 g." },
      { q: "What acceleration can humans survive?", a: "Sustained: about 5 g. Brief (crash): 30+ g if properly restrained. Pilot ejection can exceed 20 g." },
    ],
    related: [
      { id: "speed", label: "Speed", reason: "Time-integrated acceleration = velocity." },
      { id: "force", label: "Force", reason: "F = m × a." },
      { id: "acceleration-angular", label: "Angular Acceleration", reason: "Rotational counterpart in rad/s²." },
    ],
  },

  torque: {
    intro: [
      "Torque is a rotational analogue of force: it's a force applied at a distance from a pivot. SI units are newton-meters (N·m); mechanical engineers frequently use pound-foot (lbf·ft), kgf·m and inch-ounce (in·oz) for small motors. This is not the same as energy, even though the base units also work out to J — the vector nature is different.",
      "Popular jumps: N·m ↔ lbf·ft, N·m ↔ kgf·m, in·lb ↔ N·m for fastener torque specs.",
    ],
    faqs: [
      { q: "How many N·m in a lb·ft?", a: "1 lbf·ft = 1.3558179483 N·m. Same numeric factor as the ft-lb energy unit — but torque is a different physical quantity." },
      { q: "Is pound-foot the same as foot-pound?", a: "Convention varies. In modern US automotive usage 'lb-ft' or 'pound-foot' = torque; 'ft-lb' or 'foot-pound' = energy. They share numeric factors but different physical meanings." },
      { q: "How do I convert torque to horsepower?", a: "HP = torque (lb·ft) × RPM / 5,252. This is where the classic dyno curves cross at 5,252 rpm." },
      { q: "How much torque does a car engine make?", a: "Typical cars: 150–300 N·m. Diesel trucks: 500–1,500 N·m. EVs deliver peak torque from 0 rpm." },
      { q: "What torque should I use on a lug nut?", a: "Passenger vehicles: typically 80–100 lb·ft (~110–135 N·m). Always follow the manufacturer's spec." },
    ],
    related: [
      { id: "force", label: "Force", reason: "Torque = force × moment arm." },
      { id: "energy", label: "Energy", reason: "Same base units, different physical meaning." },
      { id: "moment-of-force", label: "Moment of Force", reason: "General moment quantity." },
      { id: "velocity-angular", label: "Angular Velocity", reason: "Power = torque × ω." },
    ],
  },

  current: {
    intro: [
      "Electric current is measured in amperes — one of the seven SI base units. Everyday circuits use amps and milliamps; batteries and microelectronics reach microamps and nanoamps. The abampere (biot) and statampere are legacy CGS units still occasionally seen in physics texts.",
      "Popular jumps: A ↔ mA, mA ↔ µA. Combine with the Voltage and Resistance converters to close out Ohm's-law calculations.",
    ],
    faqs: [
      { q: "How many milliamps in an amp?", a: "1 A = 1,000 mA = 1,000,000 µA." },
      { q: "How much current does a typical outlet supply?", a: "US 120 V outlets are usually rated 15 A or 20 A. EU 230 V outlets are typically 16 A." },
      { q: "How is current related to voltage and resistance?", a: "Ohm's law: I = V / R. Amps = volts ÷ ohms. Use the Voltage and Resistance converters for the other two." },
      { q: "What's the difference between AC and DC current?", a: "The unit (ampere) is the same. AC alternates direction (sinusoidal in the mains); DC is one-directional. Conversions between AC and DC aren't unit conversions — they involve rectification and RMS math." },
      { q: "How dangerous is 1 amp?", a: "Currents above ~30 mA through the body can be lethal. The number depends on path and duration, not amperes alone." },
    ],
    related: [
      { id: "voltage", label: "Voltage", reason: "V = I × R (Ohm's law)." },
      { id: "resistance", label: "Resistance", reason: "R = V / I." },
      { id: "charge", label: "Electric Charge", reason: "Charge = current × time." },
    ],
  },

  voltage: {
    intro: [
      "Voltage — potential difference — is measured in volts (V = J/C). Consumer electronics run 1.5 V (batteries) to 240 V (mains); power transmission uses kV and MV; car electronics use 12 V and 48 V; USB-C PD ranges 5–48 V.",
      "Popular jumps: V ↔ mV, V ↔ kV.",
    ],
    faqs: [
      { q: "What voltage does a wall outlet supply?", a: "US: 120 V RMS at 60 Hz. EU / UK / most of the world: 230 V at 50 Hz. Japan: 100 V." },
      { q: "How many volts in a kilovolt?", a: "1 kV = 1,000 V. Transmission lines run 100 kV to 1,000+ kV." },
      { q: "Is USB always 5 V?", a: "Legacy USB is 5 V. USB Power Delivery negotiates 5, 9, 15, 20, 28, 36 or 48 V up to 240 W." },
      { q: "How is voltage related to current?", a: "Ohm's law: V = I × R. And power = V × I in DC." },
      { q: "What's peak vs RMS voltage?", a: "Mains AC 'voltage' is RMS (root-mean-square). Peak = RMS × √2. So 120 V RMS ≈ 170 V peak." },
    ],
    related: [
      { id: "current", label: "Electric Current", reason: "Ohm's law pairs the two." },
      { id: "resistance", label: "Resistance", reason: "V = I × R." },
      { id: "power", label: "Power", reason: "P = V × I." },
      { id: "electric-field-strength", label: "Electric Field Strength", reason: "V/m — voltage per length." },
    ],
  },

  resistance: {
    intro: [
      "Electrical resistance is measured in ohms (Ω = V/A). Multiples range from milliohms (shunts, contacts, PCB traces) to megaohms (insulation, high-impedance inputs). This converter also carries the reciprocal — conductance in siemens (S = 1/Ω) — for admittance work.",
      "Popular jumps: Ω ↔ kΩ ↔ MΩ.",
    ],
    faqs: [
      { q: "How many ohms in a kilohm?", a: "1 kΩ = 1,000 Ω. 1 MΩ = 1,000,000 Ω." },
      { q: "What's the resistance of a copper wire?", a: "About 1.68 × 10⁻⁸ Ω·m resistivity. A 1 m length of 1 mm² copper wire is roughly 17 mΩ." },
      { q: "How is resistance related to conductance?", a: "G = 1 / R. A 100 Ω resistor has 10 mS of conductance." },
      { q: "Does resistance change with temperature?", a: "Yes. Metals increase resistance with temperature (positive tempco); semiconductors decrease. The converter handles unit conversion, not thermal drift." },
      { q: "What's impedance vs resistance?", a: "Resistance is real (DC); impedance is complex (AC), combining resistance and reactance. Impedance is measured in ohms too." },
    ],
    related: [
      { id: "voltage", label: "Voltage", reason: "Ohm's law pairing." },
      { id: "current", label: "Electric Current", reason: "Ohm's law pairing." },
      { id: "electric-conductance", label: "Electric Conductance", reason: "Reciprocal of resistance (siemens)." },
      { id: "electric-resistivity", label: "Electric Resistivity", reason: "Bulk material property Ω·m." },
    ],
  },

  flow: {
    intro: [
      "Volumetric flow rate is the volume passing a point per unit time. Plumbing uses GPM (gallons per minute); industrial process uses m³/h; small labs use mL/min; municipal water uses ML/day. The converter carries exact factors between all of them via the SI unit m³/s.",
      "Popular jumps: GPM ↔ L/min, L/s ↔ m³/h, GPM ↔ m³/h.",
    ],
    faqs: [
      { q: "How many L/min in a US GPM?", a: "1 US GPM = 3.785411784 L/min. UK GPM (Imperial) = 4.54609 L/min." },
      { q: "How many m³/h in a L/s?", a: "1 L/s = 3.6 m³/h exactly." },
      { q: "What's a typical shower flow rate?", a: "Standard US showerheads: 2.5 GPM (9.5 L/min). Low-flow: 1.8 GPM (6.8 L/min). EU limits vary by region." },
      { q: "How do I convert flow rate to velocity?", a: "Velocity = flow / cross-section area. So 1 L/s through a 25 mm pipe = 0.001 m³/s ÷ (π × 0.0125²) ≈ 2.04 m/s." },
      { q: "Is 1 gallon per minute the same in US and UK?", a: "No. Always specify which gallon — the UK Imperial gallon is 20% larger." },
    ],
    related: [
      { id: "volume", label: "Volume", reason: "Numerator of volumetric flow." },
      { id: "time", label: "Time", reason: "Denominator of volumetric flow." },
      { id: "flow-mass", label: "Mass Flow", reason: "Mass per time — kg/s, kg/h, lb/h." },
      { id: "speed", label: "Speed", reason: "Flow ÷ area = velocity." },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Group-level related suggestions (used by the fallback)                    */
/* -------------------------------------------------------------------------- */

const GROUP_RELATED: Record<string, RelatedConverter[]> = {
  common: [
    { id: "length", label: "Length", reason: "Everyday distance conversions." },
    { id: "weight", label: "Weight & Mass", reason: "kg, lb, oz and more." },
    { id: "volume", label: "Volume", reason: "Liters, gallons, cups, fluid ounces." },
    { id: "temperature", label: "Temperature", reason: "Celsius, Fahrenheit, Kelvin." },
  ],
  engineering: [
    { id: "force", label: "Force", reason: "Newtons, pounds-force, kilograms-force." },
    { id: "pressure", label: "Pressure", reason: "Pascals, bar, psi." },
    { id: "torque", label: "Torque", reason: "N·m, lb·ft, kgf·m." },
    { id: "energy", label: "Energy", reason: "Joules, kWh, BTU." },
  ],
  heat: [
    { id: "temperature", label: "Temperature", reason: "Celsius, Fahrenheit, Kelvin." },
    { id: "energy", label: "Energy", reason: "Joules, calories, BTU." },
    { id: "power", label: "Power", reason: "Watts, BTU/hr, refrigeration tons." },
  ],
  fluids: [
    { id: "flow", label: "Volumetric Flow", reason: "GPM, L/s, m³/h." },
    { id: "volume", label: "Volume", reason: "Liters, gallons, cubic meters." },
    { id: "density", label: "Density", reason: "kg/m³, g/cm³, lb/ft³." },
  ],
  light: [
    { id: "illumination", label: "Illumination", reason: "Lux, foot-candles." },
    { id: "luminance", label: "Luminance", reason: "cd/m², lamberts." },
    { id: "luminous-intensity", label: "Luminous Intensity", reason: "Candela." },
  ],
  electricity: [
    { id: "voltage", label: "Voltage", reason: "Volts, millivolts, kilovolts." },
    { id: "current", label: "Electric Current", reason: "Amperes." },
    { id: "resistance", label: "Resistance", reason: "Ohms and multiples." },
    { id: "power", label: "Power", reason: "Watts, kilowatts, horsepower." },
  ],
  magnetism: [
    { id: "magnetic-flux", label: "Magnetic Flux", reason: "Weber, maxwell." },
    { id: "magnetic-flux-density", label: "Magnetic Flux Density", reason: "Tesla, gauss." },
    { id: "current", label: "Electric Current", reason: "Amperes drive magnetic fields." },
  ],
  radiology: [
    { id: "radiation", label: "Radiation Dose Equivalent", reason: "Sievert, rem." },
    { id: "radiation-activity", label: "Radiation Activity", reason: "Becquerel, curie." },
    { id: "radiation-absorbed-dose", label: "Radiation Absorbed Dose", reason: "Gray, rad." },
  ],
  other: [
    { id: "length", label: "Length", reason: "Common reference conversions." },
    { id: "time", label: "Time", reason: "Seconds, minutes, hours, days." },
    { id: "data", label: "Digital Storage", reason: "Bytes, KB, MB, GB." },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Smart fallback for categories without hand-authored content               */
/* -------------------------------------------------------------------------- */

function fallbackContent(category: Category): CategoryContent {
  const name = category.name;
  const lower = name.toLowerCase();
  const unitCount = category.units.length;
  const base = category.units.find((u) => u.id === category.baseUnit);
  const baseName = base?.name ?? category.baseUnit;
  const baseSymbol = base?.symbol ?? category.baseUnit;
  const sampleUnits = category.units.slice(0, Math.min(6, unitCount));
  const sampleList = sampleUnits.map((u) => `${u.name} (${u.symbol})`).join(", ");
  const alt = category.units.find((u) => u.id !== category.baseUnit);

  const intro: string[] = [
    `The ${name} converter translates values between ${unitCount} ${lower} units built around the SI reference ${baseName} (${baseSymbol}). Supported units include ${sampleList}${unitCount > sampleUnits.length ? `, plus ${unitCount - sampleUnits.length} more` : ""} — each stored with 12-digit precision constants aligned with NIST SP 811 so results are engineering-grade rather than rounded classroom figures.`,
    `${category.description} Enter any value into the converter above and switch units in a click, or open one of the popular pair pages below for a dedicated formula, worked example and FAQ.`,
  ];

  const faqs: CategoryFAQ[] = [
    {
      q: `Which ${lower} units does this tool support?`,
      a: `${unitCount} units in total: ${sampleList}${unitCount > sampleUnits.length ? `, and ${unitCount - sampleUnits.length} more listed in the reference table below` : ""}.`,
    },
    {
      q: `What is the SI unit of ${lower}?`,
      a: `${baseName} (${baseSymbol}). Every other unit here is stored as an exact multiplier of ${baseSymbol}, so any conversion between two units routes through the SI base value.`,
    },
    {
      q: "How accurate are the conversions?",
      a: "All factors carry 12 significant digits internally and follow NIST Special Publication 811 conventions. Displayed values are rounded for readability without loss of precision in the underlying calculation.",
    },
    {
      q: "Is this converter free for professional use?",
      a: "Yes — it's free for personal, educational and commercial workflows. See the Methodology page for the standards references used to derive each constant.",
    },
  ];

  if (alt) {
    faqs.push({
      q: `How do I convert ${baseName.toLowerCase()} to ${alt.name.toLowerCase()}?`,
      a: `Enter the value in ${baseName} (${baseSymbol}) in the input above and select ${alt.name} (${alt.symbol}) as the target unit. The result appears instantly. The reference table further down lists the exact factor.`,
    });
  }

  const related: RelatedConverter[] = GROUP_RELATED[category.group] ?? GROUP_RELATED.other;

  return { intro, faqs, related: related.filter((r) => r.id !== category.id).slice(0, 4) };
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export function getCategoryContent(category: Category): CategoryContent {
  const authored = CONTENT[category.id];
  if (authored) {
    // Filter out any self-references in related list just in case.
    return { ...authored, related: authored.related.filter((r) => r.id !== category.id) };
  }
  return fallbackContent(category);
}
