import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORY_MAP } from "@/lib/converters/data";

export default defineTool({
  name: "list_units",
  title: "List units in a category",
  description:
    "Return every unit available inside a conversion category. Use the category ID returned by `list_categories` (e.g. 'length', 'weight', 'pressure').",
  inputSchema: {
    category: z.string().describe("Category ID, e.g. 'length', 'temperature', 'pressure'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const cat = CATEGORY_MAP[category];
    if (!cat) {
      return {
        content: [{ type: "text", text: `Unknown category '${category}'. Call list_categories to see valid IDs.` }],
        isError: true,
      };
    }
    const units = cat.units.map((u) => ({
      id: u.id,
      name: u.name,
      symbol: u.symbol,
      aliases: u.aliases ?? [],
    }));
    return {
      content: [{ type: "text", text: JSON.stringify({ category: cat.id, baseUnit: cat.baseUnit, units }, null, 2) }],
      structuredContent: { category: cat.id, baseUnit: cat.baseUnit, units },
    };
  },
});
