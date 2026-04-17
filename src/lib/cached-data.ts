import { cache } from "react";

import { getProjectById } from "@/data/projects";
import { getComparisonPageBySlug } from "@/data/pseo/comparisons";
import { getIntegrationPageBySlug } from "@/data/pseo/integrations";
import { getMigrationPageBySlug } from "@/data/pseo/migrations";
import { getPageBySlug } from "@/data/pseo/pages";
import { getTechnology } from "@/data/pseo/technologies";
import { getRolePageBySlug } from "@/data/roles/pages";

/**
 * React.cache()-wrapped data fetchers for dynamic routes.
 *
 * Each dynamic route invokes its primary data lookup three times
 * per render: generateStaticParams, generateMetadata, default export.
 * Without cache(), each call runs an independent .find() over the
 * full dataset. Wrapping in cache() dedupes calls with the same
 * argument within a single React render pass.
 *
 * All fetchers normalize `undefined` to `null` so callers can
 * distinguish "not cached yet" from "cached as not found" if needed.
 */

export const getPseoPageBySlug = cache((slug: string) => getPageBySlug(slug) ?? null);

export const getComparisonBySlug = cache((slug: string) => getComparisonPageBySlug(slug) ?? null);

export const getIntegrationBySlug = cache((slug: string) => getIntegrationPageBySlug(slug) ?? null);

export const getMigrationBySlug = cache((slug: string) => getMigrationPageBySlug(slug) ?? null);

export const getTechnologyBySlug = cache((slug: string) => getTechnology(slug) ?? null);

export const getRoleBySlug = cache((slug: string) => getRolePageBySlug(slug) ?? null);

export const getWorkBySlug = cache((slug: string) => getProjectById(slug) ?? null);
