"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence, MotionConfig, type Variants } from "motion/react";
import { profile, education, experience, skills, projects } from "@/data";
import type { ContributionsData } from "@/lib/github";
import { SkillIcon } from "./skill-icons";

const WEEKS = 53;
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const COLLAPSE_TRANSITION = { duration: 0.3, ease: EASE };

// Expand ("open"): the line wipes away right-to-left, the horizontal entries
// lift up and fade, and the detail rows/bullets slide up into place.
// Collapse ("closed"): bullets fade out progressively first, then the rows,
// while the height eases and the horizontal entries drop back into place.
const timelineBlockVariants: Variants = {
  closed: { height: "auto", opacity: 1, transition: COLLAPSE_TRANSITION },
  open: { height: 0, opacity: 0, transition: { duration: 0.25, ease: EASE } },
};
const listBlockVariants: Variants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.25, ease: EASE } },
  open: { height: "auto", opacity: 1, transition: COLLAPSE_TRANSITION },
};
const lineVariants: Variants = {
  closed: { scaleX: 1, transition: { duration: 0.3, ease: EASE, delay: 0.05 } },
  open: { scaleX: 0, transition: { duration: 0.25, ease: EASE } },
};
const dotVariants: Variants = {
  closed: { opacity: 1, transition: { duration: 0.2, ease: EASE, delay: 0.08 } },
  open: { opacity: 0, transition: { duration: 0.12, ease: EASE } },
};
const entryVariants: Variants = {
  closed: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE, delay: 0.08 + i * 0.02 } }),
  open: () => ({ opacity: 0, y: -8, transition: { duration: 0.18, ease: EASE } }),
};
const rowVariants: Variants = {
  closed: (i: number) => ({ opacity: 0, y: 8, transition: { duration: 0.15, ease: EASE, delay: 0.06 + i * 0.03 } }),
  open: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE, delay: 0.05 + i * 0.05 } }),
};
const bulletsVariants: Variants = {
  closed: (i: number) => ({ opacity: 0, y: 12, transition: { duration: 0.12, ease: EASE, delay: i * 0.03 } }),
  open: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE, delay: 0.12 + i * 0.05 } }),
};

// Single reveal animation shared by experience (mobile + desktop) and skills
function Collapse({ open, id, children }: { open: boolean; id?: string; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={COLLAPSE_TRANSITION}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SeeMoreButton({ open, onClick, controls }: { open: boolean; onClick: () => void; controls?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      className="squircle -mr-2.5 flex h-7 shrink-0 items-center gap-1 rounded-[10px] px-2.5 text-[13px] font-medium text-[var(--foreground-secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition"
    >
      {open ? "See less" : "See more"}
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="ml-0.5 flex"
        aria-hidden
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      </motion.span>
    </button>
  );
}

function IconX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 3H21.7L14.6 11.2L23 21H16.9L12.1 14.6L6.7 21H3.9L11.5 12.2L3.4 3H9.7L13.9 8.7L18.9 3ZM17.9 19.1H19.4L8.7 4.7H7.1L17.9 19.1Z" />
    </svg>
  );
}
function IconGithub({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.73c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.22 10.22 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}
function IconLinkedin({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.48-2.24-1.68-2.24-.91 0-1.45.61-1.69 1.21-.09.21-.11.51-.11.81v5.79H9.87s.05-9.39 0-10.36h3.55v1.47c.47-.73 1.31-1.76 3.2-1.76 2.33 0 4.08 1.52 4.08 4.8v5.85ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V10.09h3.56v10.36Z" />
    </svg>
  );
}
function IconExternal({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// Experience icons — matched to company domain
function IconFinance() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCloud() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M7 18a4 4 0 0 1-.9-7.9A5.5 5.5 0 0 1 17 9a4.5 4.5 0 0 1 .5 9H7z" />
    </svg>
  );
}
function IconData() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  );
}
function IconMegaphone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 11l14-6v14L3 13v-2z" strokeLinejoin="round" />
      <path d="M7 13.5V18a1.5 1.5 0 0 0 3 0v-3.2" strokeLinecap="round" />
      <path d="M17 8.5a4 4 0 0 1 0 7" strokeLinecap="round" />
    </svg>
  );
}
const experienceIcon = (icon: string) =>
  icon === "finance" ? <IconFinance /> : icon === "cloud" ? <IconCloud /> : icon === "megaphone" ? <IconMegaphone /> : <IconData />;

// Project icons – minimal geometric
function ProjectIcon({ type }: { type: string }) {
  if (type === "paykit") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M8 10h8M8 14h5" />
        <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "superzed") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M7 7h10l-8 10h10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 4l2 2M20 4l-2 2M4 20l2-2M20 20l-2-2" opacity="0.6" />
      </svg>
    );
  }
  if (type === "hitch") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M7 9l3 3-3 3M12 15h5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "pen") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" strokeLinejoin="round" />
        <path d="M14.5 6.5l3 3" strokeLinecap="round" />
      </svg>
    );
  }
  // opensec / default
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 3l7 4v5c0 4-2.8 7-7 8-4.2-1-7-4-7-8V7l7-4z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function renderInlineLinks(text: string, keyPrefix: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, j) => {
    const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (!m) return <span key={`${keyPrefix}-${j}`}>{part}</span>;
    return (
      <a key={`${keyPrefix}-${j}`} href={m[2]} target="_blank" rel="noreferrer" className="underline decoration-[var(--foreground-decoration)] underline-offset-2 hover:decoration-[var(--foreground-decoration-hover)] transition">
        {m[1]}
      </a>
    );
  });
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-[13px] leading-5 text-[var(--foreground-tertiary)]">
      {items.map((b, i) => (
        <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:size-1 before:rounded-full before:bg-[var(--foreground-quaternary)]">
          {renderInlineLinks(b, String(i))}
        </li>
      ))}
    </ul>
  );
}

type Skill = { name: string; href: string };

function SkillRow({ category, items }: { category: string; items: Skill[] }) {
  return (
    <div className="grid grid-cols-[clamp(6.4rem,20vw,8rem)_minmax(0,1fr)] gap-2 items-start">
      <h3 className="text-[13px] leading-5 text-[var(--foreground-tertiary)]">{category}</h3>
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5 sm:gap-x-4 sm:gap-y-2">
        {items.map((s) => (
          <li key={s.name}>
            <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center gap-1.5 text-[13px] leading-5 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition">
              <span className="flex size-4 shrink-0 items-center justify-center opacity-60 group-hover:opacity-100 transition" aria-hidden>
                <SkillIcon name={s.name} />
              </span>
              <span className="underline decoration-transparent group-hover:decoration-[var(--foreground-decoration)] group-hover:underline underline-offset-2">{s.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Portfolio({ contributions }: { contributions: ContributionsData }) {
  const [expandedExp, setExpandedExp] = useState<number | null>(null);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [skillsExpanded, setSkillsExpanded] = useState(false);

  const monthByColumn = new Map(contributions.months.map((m) => [m.column, m.label]));
  const chartLabel = `${contributions.total.toLocaleString("en-US")} contributions in the last year`;
  const levelClass = (level: number) => {
    if (level < 0) return "bg-transparent";
    if (level === 0) return "bg-[var(--foreground)]/10";
    if (level === 1) return "bg-[var(--foreground)]/25";
    if (level === 2) return "bg-[var(--foreground)]/45";
    if (level === 3) return "bg-[var(--foreground)]/60";
    return "bg-[var(--foreground)]/75";
  };
  const skillEntries = Object.entries(skills) as [string, Skill[]][];

  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto flex min-h-svh w-full max-w-[672px] flex-col gap-8 px-5 pt-8 sm:px-8 md:pt-14 pb-0">
        {/* Hero */}
        <header aria-label="Hero" className="flex flex-col">
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-[17px] font-medium tracking-tight leading-none">{profile.name}</h1>
              <p className="mt-1.5 text-[13px] text-[var(--muted-foreground)] leading-none">{profile.role}</p>
            </div>
            <nav aria-label="Social links">
              <ul className="flex flex-wrap gap-px">
                <li>
                  <a href={profile.links.x} aria-label="X" className="squircle flex size-7 items-center justify-center rounded-[10px] border border-transparent bg-transparent text-[var(--foreground-secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition">
                    <IconX size={14} />
                  </a>
                </li>
                <li>
                  <a href={profile.links.github} aria-label="GitHub" className="squircle flex size-7 items-center justify-center rounded-[10px] border border-transparent text-[var(--foreground-secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition">
                    <IconGithub size={14} />
                  </a>
                </li>
                <li>
                  <a href={profile.links.linkedin} aria-label="LinkedIn" className="squircle flex size-7 items-center justify-center rounded-[10px] border border-transparent text-[var(--foreground-secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition">
                    <IconLinkedin size={14} />
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-6 space-y-2.5 text-[13.5px] leading-[22px] text-[var(--foreground-secondary)]">
            <p>
              {profile.bio.split("Margin")[0]}
              <a href={profile.links.margin} target="_blank" rel="noreferrer" className="underline decoration-current underline-offset-3">
                Margin
              </a>
              {profile.bio.split("Margin")[1]}
            </p>
            <p>
              {profile.bio2.split("Hugo theme")[0]}
              <a href={profile.links.hugo} target="_blank" rel="noreferrer" className="underline decoration-current underline-offset-3">
                Hugo theme
              </a>
              {profile.bio2.split("Hugo theme")[1]}
            </p>
            <p>{profile.bio3}</p>
          </div>

          <div className="mt-[22px] flex flex-wrap gap-2">
            <a href={profile.links.email} className="squircle inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-[var(--primary)] px-3 text-[13px] font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary)]/80 transition">
              Email me <span aria-hidden>→</span>
            </a>
            <a href={profile.links.resume} target="_blank" rel="noreferrer" className="squircle inline-flex h-8 items-center gap-[3px] rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-3 text-[13px] font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition">
              View resume
            </a>
          </div>
        </header>

        {/* Performance – live GitHub graph */}
        <section aria-label="GitHub contributions" className="flex flex-col gap-5">
          <div className="no-scrollbar scroll-fade-x max-w-full overflow-x-auto overflow-y-hidden pb-1">
            <div className="w-max">
              {/* month labels */}
              <div className="mb-1.5 grid h-3 gap-[var(--contribution-gap)] text-[11px] leading-none text-[var(--muted-foreground)]" style={{ gridTemplateColumns: `repeat(${WEEKS}, 0.625rem)` }}>
                {Array.from({ length: WEEKS }, (_, column) => (
                  <span key={column}>{monthByColumn.get(column)}</span>
                ))}
              </div>
              <ol aria-label={chartLabel} className="grid grid-flow-col grid-rows-7 gap-[var(--contribution-gap)]" style={{ gridTemplateColumns: `repeat(${WEEKS}, 0.625rem)` }}>
                {contributions.cells.map((level, i) => (
                  <li key={i} className={`rounded-cell size-2.5 ${levelClass(level)}`} />
                ))}
              </ol>
            </div>
          </div>
          {contributions.total > 0 && (
            <p className="text-[11px] leading-none text-[var(--muted-foreground)] -mt-1">{chartLabel}</p>
          )}
        </section>

        {/* Experience – Mobile accordion */}
        <section className="flex flex-col gap-5 min-[570px]:hidden" aria-labelledby="experience-heading-mobile">
          <h2 id="experience-heading-mobile" className="text-sm font-medium tracking-tight">Experience</h2>
          <ol className="space-y-[22px]">
            {experience.map((job, idx) => {
              const isOpen = expandedExp === idx;
              return (
                <li key={job.company} className="group relative">
                  {/* hover bg */}
                  <button
                    type="button"
                    onClick={() => setExpandedExp(isOpen ? null : idx)}
                    className={`absolute -inset-x-3 -inset-y-2 squircle rounded-xl transition ${isOpen ? "bg-[var(--timeline-hover)]" : "group-hover:bg-[var(--timeline-hover)]"}`}
                    aria-expanded={isOpen}
                    aria-controls={`exp-mobile-${idx}`}
                  />
                  <div className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-[10px]">
                    <span className="squircle rounded-mark flex size-8 items-center justify-center border border-[var(--border)] bg-[var(--accent)] text-[var(--foreground-secondary)]">
                      {experienceIcon(job.icon)}
                    </span>
                    <div className="min-w-0 flex flex-col">
                      <h3 className="text-[14px] font-medium leading-none tracking-tight">{job.company}</h3>
                      <p className="text-[13px] text-[var(--foreground-secondary)] leading-4 mt-1">{job.role}</p>
                      <p className="text-[13px] leading-4 text-[var(--muted-foreground)] mt-0.5">{job.date}</p>
                    </div>
                    <span className="flex items-center self-start pt-0.5 text-[var(--muted-foreground)]">
                      <IconChevron open={isOpen} />
                    </span>
                  </div>
                  <Collapse open={isOpen}>
                    <div className="pl-[42px] pt-3">
                      <Bullets items={job.bullets} />
                    </div>
                  </Collapse>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Experience – Desktop timeline */}
        <section className="hidden min-[570px]:flex flex-col gap-5" aria-labelledby="experience-heading">
          <div className="flex items-center justify-between">
            <h2 id="experience-heading" className="text-sm font-medium tracking-tight">
              Experience
            </h2>
            <SeeMoreButton open={timelineExpanded} onClick={() => setTimelineExpanded((v) => !v)} controls="experience-content" />
          </div>

          <div id="experience-content" className="relative">
            {/* Horizontal timeline — collapsed state */}
            <motion.div
              initial={false}
              variants={timelineBlockVariants}
              animate={timelineExpanded ? "open" : "closed"}
              className="overflow-hidden"
              aria-hidden={timelineExpanded || undefined}
            >
              <div className="relative">
                <motion.div
                  aria-hidden
                  className="absolute left-[7px] right-0 top-[11.5px] h-px bg-[var(--timeline-line)]"
                  style={{ transformOrigin: "left center" }}
                  variants={lineVariants}
                />
                <motion.div
                  aria-hidden
                  className="absolute left-[7px] top-[11.5px] h-px bg-gradient-to-r from-[var(--foreground)]/40 to-transparent"
                  style={{
                    transformOrigin: "left center",
                    width: `calc((100% - ${(experience.length - 1) * 0.5}rem) / ${experience.length} + 5px)`,
                  }}
                  variants={lineVariants}
                />
                <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${experience.length}, minmax(0, 1fr))` }}>
                  {experience.map((job, i) => (
                    <li key={job.company} className="relative min-w-0 pt-7">
                      <motion.span
                        className="absolute left-1 top-2 flex size-2 items-center justify-center"
                        variants={dotVariants}
                        aria-hidden
                      >
                        {i === 0 && <span className="timeline-status-halo pointer-events-none absolute -inset-1.5 rounded-full" />}
                        <span className={`relative size-2 rounded-full ${i === 0 ? "bg-[var(--foreground)]" : "bg-[var(--timeline-dot)]"}`} />
                      </motion.span>
                      <motion.div className="flex min-w-0 items-center gap-[10px]" variants={entryVariants} custom={i}>
                        <span className="squircle flex size-6 shrink-0 items-center justify-center rounded-mark border border-[var(--border)] bg-[var(--accent)] text-[var(--foreground-secondary)] [&_svg]:size-3.5">
                          {experienceIcon(job.icon)}
                        </span>
                        <span className="truncate text-sm" style={{ color: i === 0 ? "var(--foreground)" : "var(--foreground-secondary)" }}>
                          {job.company}
                        </span>
                      </motion.div>
                      <motion.p
                        className="mt-1.5 truncate text-[13px] leading-none text-[var(--muted-foreground)]"
                        variants={entryVariants}
                        custom={i}
                      >
                        {job.shortDate}
                      </motion.p>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>

            {/* Vertical detail list — expanded state */}
            <motion.div
              initial={false}
              variants={listBlockVariants}
              animate={timelineExpanded ? "open" : "closed"}
              className="overflow-hidden"
              aria-hidden={!timelineExpanded || undefined}
            >
              <ol className="space-y-[22px]">
                {experience.map((job, i) => (
                  <li key={job.company} className="relative min-w-0">
                    <motion.div
                      className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-[10px] gap-y-2"
                      variants={rowVariants}
                      custom={i}
                    >
                      <span className="squircle flex size-8 shrink-0 items-center justify-center self-start rounded-mark border border-[var(--border)] bg-[var(--accent)] text-[var(--foreground-secondary)] [&_svg]:size-[18px]">
                        {experienceIcon(job.icon)}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[14px] font-medium leading-none tracking-tight" style={{ color: i === 0 ? "var(--foreground)" : "var(--foreground-secondary)" }}>{job.company}</h3>
                        <p className="mt-1 text-[13px] leading-4 text-[var(--foreground-secondary)]">{job.role}</p>
                        <p className="mt-0.5 text-[13px] leading-4 text-[var(--muted-foreground)]">{job.date}</p>
                      </div>
                    </motion.div>
                    <motion.div className="pl-[42px] pt-3" variants={bulletsVariants} custom={i}>
                      <Bullets items={job.bullets} />
                    </motion.div>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>
        </section>

        {/* Education — hidden when education[] is empty (see src/data.ts) */}
        {education.length > 0 && (
        <section aria-labelledby="education-heading" className="flex flex-col gap-5">
          <h2 id="education-heading" className="text-sm font-medium tracking-tight">Education</h2>
          <ul className="grid grid-cols-1 divide-y divide-[var(--border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {education.map((ed) => (
              <li key={`${ed.school}-${ed.degree}`} className="flex flex-col py-3 first:pt-0 last:pb-0 sm:px-5 sm:py-0 sm:first:pl-0 sm:last:pr-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-medium leading-none tracking-tight">{ed.degree}</h3>
                  <span className="text-[13px] leading-none text-[var(--muted-foreground)]">{ed.date}</span>
                </div>
                <p className="mt-2 text-[13px] leading-4 text-[var(--foreground-secondary)]">{ed.field}</p>
                <p className="mt-1 text-[13px] leading-4 text-[var(--muted-foreground)]">{ed.school}</p>
              </li>
            ))}
          </ul>
        </section>
        )}

        {/* Projects */}
        <section aria-labelledby="projects-heading" className="flex flex-col gap-5">
          <h2 id="projects-heading" className="text-sm font-medium tracking-tight">Projects</h2>
          <ul className="space-y-5.5">
            {projects.map((p) => (
              <li key={p.name}>
                <a
                  href={p.youtube ?? p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-[10px] gap-y-2 relative min-w-0 before:absolute before:-inset-x-3 before:-inset-y-2 before:squircle before:rounded-xl before:content-[''] hover:before:bg-[var(--timeline-hover)] [&>*]:relative min-[360px]:grid-cols-[auto_minmax(0,1fr)_auto] items-start"
                >
                  <span
                    aria-hidden="true"
                    className="squircle flex shrink-0 items-center justify-center rounded-mark border border-[var(--border)] bg-[var(--accent)] text-[var(--foreground-secondary)] size-8 [&_svg]:size-[18px] self-center"
                  >
                    <ProjectIcon type={p.icon} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium leading-none tracking-tight group-hover:underline decoration-[var(--foreground-decoration)] underline-offset-2">{p.name}</h3>
                    <p className="text-[13px] leading-4 text-[var(--foreground-secondary)] mt-1.5">{p.description}</p>
                  </div>
                  {p.youtube ? (
                    <span className="col-start-2 flex items-center gap-1 whitespace-nowrap text-[13px] leading-none text-[var(--muted-foreground)] min-[360px]:col-start-3 min-[360px]:row-start-1 min-[360px]:self-center">
                      <IconExternal size={12} />
                    </span>
                  ) : (
                    <span className="col-start-2 flex items-center gap-1 whitespace-nowrap text-[13px] leading-none text-[var(--muted-foreground)] min-[360px]:col-start-3 min-[360px]:row-start-1 min-[360px]:self-center">
                      <IconExternal size={12} />
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills */}
        <section aria-labelledby="skills-heading" className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 id="skills-heading" className="text-sm font-medium tracking-tight">Skills</h2>
            <SeeMoreButton open={skillsExpanded} onClick={() => setSkillsExpanded((v) => !v)} controls="skills-details" />
          </div>
          <div id="skills-details" className="space-y-4">
            {skillEntries.slice(0, 4).map(([category, items]) => (
              <SkillRow key={category} category={category} items={items} />
            ))}
            <Collapse open={skillsExpanded}>
              <div className="space-y-4">
                {skillEntries.slice(4).map(([category, items]) => (
                  <SkillRow key={category} category={category} items={items} />
                ))}
              </div>
            </Collapse>
          </div>
        </section>

        {/* Sign-off */}
        <footer className="mt-auto flex justify-center">
          <Image
            src="/footer-dark.png"
            alt="Pranam Shetty"
            width={1200}
            height={278}
            className="hidden h-auto w-full opacity-30 dark:block"
          />
          <Image
            src="/footer-light.png"
            alt="Pranam Shetty"
            width={1200}
            height={278}
            className="h-auto w-full opacity-30 dark:hidden"
          />
        </footer>
      </main>
    </MotionConfig>
  );
}
