import { buildSearchIndex } from "@/data/search-index";
import { CommandPalette } from "./command-palette";

export function CommandPaletteServer() {
	const items = buildSearchIndex();
	return <CommandPalette items={items} />;
}
