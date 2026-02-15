import { ImageResponse } from "next/og";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const title = searchParams.get("title") || "Alex Mayhew";
	const description = searchParams.get("description") || "";
	const category = searchParams.get("category") || "";

	let interFont: ArrayBuffer | null = null;
	let monoFont: ArrayBuffer | null = null;

	try {
		const baseUrl = request.nextUrl.origin;
		const [interData, monoData] = await Promise.all([
			fetch(`${baseUrl}/fonts/inter-latin-var.woff2`).then((r) => r.arrayBuffer()),
			fetch(`${baseUrl}/fonts/jetbrains-mono-latin-var.woff2`).then((r) => r.arrayBuffer()),
		]);
		interFont = interData;
		monoFont = monoData;
	} catch {
		// Fallback to system fonts if loading fails
	}

	const fonts: { name: string; data: ArrayBuffer; style: "normal"; weight: 400 | 700 }[] = [];
	if (interFont) {
		fonts.push({ name: "Inter", data: interFont, style: "normal" as const, weight: 400 });
	}
	if (monoFont) {
		fonts.push({
			name: "JetBrains Mono",
			data: monoFont,
			style: "normal" as const,
			weight: 400,
		});
	}

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "row",
				backgroundColor: "#0B0E14",
				padding: "60px",
			}}
		>
			{/* Left accent bar */}
			<div
				style={{
					width: "4px",
					height: "100%",
					backgroundColor: "#CCF381",
					marginRight: "48px",
					flexShrink: 0,
				}}
			/>

			{/* Content */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					flex: 1,
					minWidth: 0,
				}}
			>
				{/* Top: Category badge */}
				<div style={{ display: "flex" }}>
					{category && (
						<div
							style={{
								fontFamily: monoFont ? "JetBrains Mono" : "monospace",
								fontSize: "14px",
								color: "#CCF381",
								textTransform: "uppercase",
								letterSpacing: "0.1em",
								border: "1px solid rgba(204, 243, 129, 0.4)",
								padding: "6px 14px",
							}}
						>
							{category}
						</div>
					)}
				</div>

				{/* Middle: Title + Description */}
				<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
					<div
						style={{
							fontFamily: interFont ? "Inter" : "system-ui, sans-serif",
							fontSize: title.length > 60 ? "36px" : "48px",
							fontWeight: 700,
							color: "#E2E8F0",
							lineHeight: 1.2,
							maxWidth: "900px",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{title}
					</div>
					{description && (
						<div
							style={{
								fontFamily: interFont ? "Inter" : "system-ui, sans-serif",
								fontSize: "22px",
								color: "#94A3B8",
								lineHeight: 1.4,
								maxWidth: "800px",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
						>
							{description.length > 120 ? description.slice(0, 120) + "..." : description}
						</div>
					)}
				</div>

				{/* Bottom: Site name */}
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						fontFamily: monoFont ? "JetBrains Mono" : "monospace",
						fontSize: "16px",
						color: "#94A3B8",
					}}
				>
					alexmayhew.dev
				</div>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			fonts: fonts.length > 0 ? fonts : undefined,
		}
	);
}
