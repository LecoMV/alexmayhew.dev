import { BlogThemeProvider } from "@/lib/blog-themes";
import type { ReactNode } from "react";

export default function BlogLayout({ children }: { children: ReactNode }) {
	return <BlogThemeProvider>{children}</BlogThemeProvider>;
}
