// Regenerates src/components/skill-icon-paths.ts from simple-icons.
// Usage: npm run icons   (installs simple-icons as a dev dependency first if needed)
import * as si from "simple-icons";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// skill name (must match src/data.ts) -> simple-icons slug
// NOTE: simple-icons dropped the OpenAI brand icon — OpenAI falls back
// to a monogram badge in skill-icons.tsx (see BADGE_LABELS).
const WANT = {
  Python: "siPython",
  TypeScript: "siTypescript",
  JavaScript: "siJavascript",
  R: "siR",
  PyTorch: "siPytorch",
  LangChain: "siLangchain",
  LangGraph: "siLanggraph",
  "Hugging Face": "siHuggingface",
  Pandas: "siPandas",
  PySpark: "siApachespark",
  MongoDB: "siMongodb",
  Supabase: "siSupabase",
  React: "siReact",
  "Next.js": "siNextdotjs",
  "Tailwind CSS": "siTailwindcss",
  Streamlit: "siStreamlit",
  Flask: "siFlask",
  "Node.js": "siNodedotjs",
  Docker: "siDocker",
  GitHub: "siGithub",
};

const entries = Object.entries(WANT).map(([name, slug]) => {
  if (!si[slug]) throw new Error(`${slug} no longer exists in simple-icons — find a new slug or add a fallback in skill-icons.tsx`);
  return `  "${name}":
    "${si[slug].path}",`;
});

const out =
  "// Monochrome brand icons for skills, generated from simple-icons (simpleicons.org).\n" +
  "// 24x24 paths rendered with fill=currentColor. Regenerate with `npm run icons`.\n" +
  "export const SKILL_ICON_PATHS: Record<string, string> = {\n" +
  entries.join("\n") +
  "\n};\n";

writeFileSync(join(root, "src/components/skill-icon-paths.ts"), out);
console.log(`Wrote ${entries.length} icons to src/components/skill-icon-paths.ts`);
