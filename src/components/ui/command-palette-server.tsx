import { buildSearchIndex } from "@/data/search-index";

import { LazyCommandPalette } from "./lazy-command-palette";

export function LazyCommandPaletteServer() {
	const items = buildSearchIndex();
	return <LazyCommandPalette items={items} />;
}
