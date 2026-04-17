// Local business data is consolidated into the main JsonLd component's
// ConsultingService schema (json-ld.tsx #business entity).
//
// @deprecated ... remove import from src/app/layout.tsx in next sprint and
// exists in layout.tsx (owned by another agent this sprint).
export function LocalBusinessJsonLd() {
	if (process.env.NODE_ENV === "development") {
		console.warn(
			"[LocalBusinessJsonLd] deprecated: this component is a no-op stub. Remove the import from src/app/layout.tsx and delete this file."
		);
	}
	return null;
}
