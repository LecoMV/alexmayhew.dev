import { notFound } from "next/navigation";

import { showAdminUI } from "../../../keystatic.config";

export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
	if (!showAdminUI) notFound();
	return <>{children}</>;
}
