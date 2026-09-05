import { SKILL_ICON_PATHS } from "./skill-icon-paths";

// Brands missing from simple-icons: Motion gets a hand-drawn mark,
// the rest fall back to a small monogram badge (like the "Ps" in the reference).
const EXTRA_PATHS: Record<string, string> = {
  // three forward slashes, like the motion.dev mark
  Motion:
    "M2 17 6.5 7h2.8L4.8 17H2zm5.4 0L11.9 7h2.8l-4.5 10H7.4zm5.4 0L17.3 7h2.8l-4.5 10h-2.8z",
};

const BADGE_LABELS: Record<string, string> = {
  // simple-icons no longer ships an OpenAI brand mark
  OpenAI: "O",
  AWS: "aws",
  Photoshop: "Ps",
};

export function SkillIcon({ name }: { name: string }) {
  const path = SKILL_ICON_PATHS[name] ?? EXTRA_PATHS[name];
  if (path) {
    return (
      <svg viewBox="0 0 24 24" className="size-full fill-current" aria-hidden>
        <path d={path} />
      </svg>
    );
  }
  return (
    <span className="flex size-full items-center justify-center rounded-[3px] border border-[var(--border)] bg-[var(--accent)] text-[7px] font-bold leading-none">
      {BADGE_LABELS[name] ?? name[0]}
    </span>
  );
}
