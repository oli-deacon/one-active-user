import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import type { Build, Story } from "@/lib/types";

const contentRoot = path.join(process.cwd(), "src", "content");

const storySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  author: z.string().min(1),
  publishedAt: z.coerce.string().min(1),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  coverImage: z.string().optional(),
});

const buildSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().min(1),
  friction: z.string().min(1),
  whyExistingToolsWereNotEnough: z.string().min(1),
  whoItIsFor: z.string().min(1),
  howItWasBuilt: z.string().min(1),
  howItIsUsedNow: z.string().min(1),
  currentStatus: z.string().min(1),
  author: z.string().min(1),
  publishedAt: z.coerce.string().min(1),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  screenshots: z.array(z.string()).optional(),
  externalLink: z.string().url().optional(),
});

async function readMdxFiles(directory: string) {
  const dir = path.join(contentRoot, directory);
  const entries = await fs.readdir(dir);
  return entries.filter((entry) => entry.endsWith(".mdx")).map((entry) => path.join(dir, entry));
}

function byNewest<T extends { publishedAt: string }>(items: T[]) {
  return [...items].sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
}

function assertUniqueSlugs<T extends { slug: string }>(items: T[], label: string) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.slug)) {
      throw new Error(`Duplicate ${label} slug detected: ${item.slug}`);
    }
    seen.add(item.slug);
  }
}

async function parseStory(filePath: string): Promise<Story> {
  const source = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(source);
  const parsed = storySchema.parse(data);

  return {
    ...parsed,
    body: content,
    url: `/stories/${parsed.slug}`,
  };
}

async function parseBuild(filePath: string): Promise<Build> {
  const source = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(source);
  const parsed = buildSchema.parse(data);

  return {
    ...parsed,
    body: content,
    url: `/builds/${parsed.slug}`,
  };
}

export async function getAllStories() {
  const files = await readMdxFiles("stories");
  const stories = await Promise.all(files.map(parseStory));
  assertUniqueSlugs(stories, "story");
  return byNewest(stories);
}

export async function getAllBuilds() {
  const files = await readMdxFiles("builds");
  const builds = await Promise.all(files.map(parseBuild));
  assertUniqueSlugs(builds, "build");
  return byNewest(builds);
}

export async function getStoryBySlug(slug: string) {
  const stories = await getAllStories();
  return stories.find((story) => story.slug === slug) ?? null;
}

export async function getBuildBySlug(slug: string) {
  const builds = await getAllBuilds();
  return builds.find((build) => build.slug === slug) ?? null;
}

export async function getFeaturedStory() {
  const stories = await getAllStories();
  return stories.find((story) => story.featured) ?? stories[0] ?? null;
}

export async function getFeaturedBuilds(limit = 3) {
  const builds = await getAllBuilds();
  const featured = builds.filter((build) => build.featured);
  return (featured.length > 0 ? featured : builds).slice(0, limit);
}

export function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(value));
}

export function collectRelatedStories(stories: Story[], story: Story, limit = 2) {
  const tagSet = new Set(story.tags);
  return stories
    .filter((candidate) => candidate.slug !== story.slug)
    .map((candidate) => ({
      candidate,
      score: candidate.tags.filter((tag) => tagSet.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
