import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORIES } from "../../converters/data";
import { GROUP_LABELS } from "../../converters/types";

export default defineTool({
  name: "list_categories",
  title: "List conversion categories",
  description:
    "List every supported unit-conversion category (length, weight, temperature, pressure, etc.) with its ID, name, group, and short description.",
  inputSchema: {
    group: z
      .string()
      .optional()
      .describe(
        "Optional group filter: common, engineering, heat, fluids, light, electricity, magnetism, radiology, other.",
      ),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ group }) => {
    const filtered = group ? CATEGORIES.filter((c) => c.group === group) : CATEGORIES;
    const items = filtered.map((c) => ({
      id: c.id,
      name: c.name,
      group: c.group,
      groupLabel: GROUP_LABELS[c.group],
      description: c.description,
      unitCount: c.units.length,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { categories: items, total: items.length },
    };
  },
});
