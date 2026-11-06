/**
 * Server-side payload builders. Route handlers serialise these, and the page uses
 * the same functions for its first render so there is one source of truth.
 * Project links come only from `projects[].links` in content.ts.
 */
import {
  education,
  metrics,
  profile,
  projects,
  sections,
  skills,
  stack,
  stages,
  visibleLinks,
  worlds,
} from '@/data/content';

export function getProjects() {
  return {
    count: projects.length,
    projects: projects.map((p, i) => ({
      id: i + 1,
      title: p.title,
      desc: p.desc,
      tech: p.tech,
      domain: p.domain,
      outcome: p.outcome,
      status: p.links.length ? ('public' as const) : ('private' as const),
      links: p.links,
    })),
  };
}

export function getExperience() {
  return { metrics, stages, education };
}

export function getSkills() {
  const categories = Array.from(new Set(skills.map((s) => s.category))).map((name) => ({
    name,
    count: skills.filter((s) => s.category === name).length,
  }));
  return { total: skills.length, categories, tiers: stack.tiers, skills };
}

export function getStats() {
  return {
    name: profile.name,
    role: profile.role,
    availability: profile.availability,
    timezone: profile.timezone,
    base: profile.baseLocation,
    email: profile.email,
    links: Object.fromEntries(visibleLinks().map((l) => [l.id, l.href])),
    worlds: worlds.map((w) => w.path),
    sections: sections.map((s) => s.path),
    counts: {
      projects: projects.length,
      skills: skills.length,
      stages: stages.length,
    },
    resume: profile.resume.href,
    cgpa: education.college.cgpa,
    generatedAt: new Date().toISOString(),
  };
}

export type ProjectsPayload = ReturnType<typeof getProjects>;
export type ExperiencePayload = ReturnType<typeof getExperience>;
export type SkillsPayload = ReturnType<typeof getSkills>;
export type StatsPayload = ReturnType<typeof getStats>;
