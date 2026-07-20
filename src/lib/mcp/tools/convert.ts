import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORY_MAP, convert, formatResult } from "../../converters/data";

export default defineTool({
  name: "convert",
  title: "Convert a value between units",
  description:
    "Convert a numeric value from one unit to another within a category. Use category/unit IDs returned by `list_categories` and `list_units`. Example: category='length', from='ft', to='cm', value=5.917.",
  inputSchema: {
    category: z.string().describe("Category ID, e.g. 'length', 'temperature'."),
    from: z.string().describe("Source unit ID, e.g. 'ft'."),
    to: z.string().describe("Target unit ID, e.g. 'cm'."),
    value: z.number().finite().describe("Numeric value to convert."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, from, to, value }) => {
    const cat = CATEGORY_MAP[category];
    if (!cat) {
      return {
        content: [{ type: "text", text: `Unknown category '${category}'.` }],
        isError: true,
      };
    }
    const fromUnit = cat.units.find((u) => u.id === from);
    const toUnit = cat.units.find((u) => u.id === to);
    if (!fromUnit || !toUnit) {
      return {
        content: [
          {
            type: "text",
            text: `Unknown unit in category '${category}': from='${from}' to='${to}'. Call list_units for valid IDs.`,
          },
        ],
        isError: true,
      };
    }
    const result = convert(cat, value, from, to);
    if (!Number.isFinite(result)) {
      return { content: [{ type: "text", text: "Conversion produced a non-finite result." }], isError: true };
    }
    const formatted = formatResult(result);
    const summary = `${formatResult(value)} ${fromUnit.symbol} = ${formatted} ${toUnit.symbol}`;
    return {
      content: [{ type: "text", text: summary }],
      structuredContent: {
        category: cat.id,
        from: { id: fromUnit.id, name: fromUnit.name, symbol: fromUnit.symbol },
        to: { id: toUnit.id, name: toUnit.name, symbol: toUnit.symbol },
        input: value,
        result,
        resultFormatted: formatted,
      },
    };
  },
});
