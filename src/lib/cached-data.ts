import { cache } from "react";

import { getProjectById } from "@/data/projects";

/**
 * React.cache()-wrapped data fetchers for dynamic routes.
 *
 * A dynamic route invokes its primary data lookup three times per render
 * (generateStaticParams, generateMetadata, default export). Without cache(),
 * each call runs an independent .find() over the full dataset. Wrapping in
 * cache() dedupes calls with the same argument within a single React render.
 *
 * Normalizes `undefined` to `null` so callers can distinguish "not cached yet"
 * from "cached as not found" if needed.
 *
 * The pSEO / role fetchers were removed in the 2026-08 reposition when the
 * programmatic service pages and the /for funnel were retired.
 */
export const getWorkBySlug = cache((slug: string) => getProjectById(slug) ?? null);
