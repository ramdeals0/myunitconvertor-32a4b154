import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { parseConversionQuery } from "../../parseConversionQuery";
import { convert, formatResult } from "../../converters/data";

export default defineTool({
  name: "parse_and_convert",
  title: "Parse a natural-language conversion",
  description:
    "Parse and evaluate a natural-language conversion query such as '5 ft 11 in to cm', '70 F in C', or '250 grams to ounces'. Returns the detected category, source/target units, and the converted value.",
  inputSchema: {
    query: z.string().min(1).describe("Natural-language conversion query."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const parsed = parseConversionQuery(query);
    if (!parsed) {
      return {
        content: [
          {
            type: "text",
            text: `Could not parse '${query}'. Try formats like '5 km to miles' or '70 F in C'.`,
          },
        ],
        isError: true,
      };
    }
    const result = convert(parsed.category, parsed.value, parsed.from.id, parsed.to.id);
    if (!Number.isFinite(result)) {
      return { content: [{ type: "text", text: "Conversion produced a non-finite result." }], isError: true };
    }
    const formatted = formatResult(result);
    const summary = `${formatResult(parsed.value)} ${parsed.from.symbol} = ${formatted} ${parsed.to.symbol}`;
    return {
      content: [{ type: "text", text: summary }],
      structuredContent: {
        query,
        category: parsed.category.id,
        from: { id: parsed.from.id, name: parsed.from.name, symbol: parsed.from.symbol },
        to: { id: parsed.to.id, name: parsed.to.name, symbol: parsed.to.symbol },
        input: parsed.value,
        result,
        resultFormatted: formatted,
      },
    };
  },
});
