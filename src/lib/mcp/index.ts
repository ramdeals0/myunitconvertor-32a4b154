import { defineMcp } from "@lovable.dev/mcp-js";
import convertTool from "./tools/convert";
import listCategoriesTool from "./tools/list-categories";
import listUnitsTool from "./tools/list-units";
import parseAndConvertTool from "./tools/parse-and-convert";

export default defineMcp({
  name: "turbo-unit-converter-mcp",
  title: "Turbo Unit Converter",
  version: "0.1.0",
  instructions:
    "Precise unit conversion tools covering 75+ categories (length, weight, temperature, volume, pressure, energy, power, speed, data, and many engineering, heat, fluids, light, electricity, magnetism, and radiology categories). Use `list_categories` to discover categories, `list_units` for units in a category, `convert` to run a conversion by category/unit IDs, and `parse_and_convert` for natural-language queries like '5 ft 11 in to cm'.",
  tools: [convertTool, listCategoriesTool, listUnitsTool, parseAndConvertTool],
});
