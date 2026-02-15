/**
 * Logic Density Ratio (LDR) Measurement Script
 *
 * Measures the ratio of "real logic" (branching, mutations, computations)
 * to total lines of code. AI-generated code typically scores 0.05-0.15,
 * while expert human code scores 0.25-0.40.
 *
 * Usage:
 *   npx tsx scripts/measure-ldr.ts [--threshold 0.1] [--verbose] [path]
 */
import { Project, SyntaxKind } from "ts-morph";

interface FileReport {
	path: string;
	totalLines: number;
	logicNodes: number;
	ldr: number;
}

const LOGIC_KINDS = [
	SyntaxKind.IfStatement,
	SyntaxKind.ConditionalExpression,
	SyntaxKind.SwitchStatement,
	SyntaxKind.ForStatement,
	SyntaxKind.ForInStatement,
	SyntaxKind.ForOfStatement,
	SyntaxKind.WhileStatement,
	SyntaxKind.DoStatement,
	SyntaxKind.BinaryExpression,
	SyntaxKind.ReturnStatement,
	SyntaxKind.ThrowStatement,
	SyntaxKind.TryStatement,
	SyntaxKind.AwaitExpression,
	SyntaxKind.YieldExpression,
	SyntaxKind.CallExpression,
] as const;

function measureFile(file: ReturnType<Project["getSourceFiles"]>[number]): FileReport {
	let logicNodes = 0;

	for (const kind of LOGIC_KINDS) {
		logicNodes += file.getDescendantsOfKind(kind).length;
	}

	const totalLines = file.getEndLineNumber();

	return {
		path: file.getFilePath().replace(process.cwd() + "/", ""),
		totalLines,
		logicNodes,
		ldr: totalLines > 0 ? logicNodes / totalLines : 0,
	};
}

function main() {
	const args = process.argv.slice(2);
	const verbose = args.includes("--verbose");
	const thresholdIdx = args.indexOf("--threshold");
	const threshold = thresholdIdx !== -1 ? parseFloat(args[thresholdIdx + 1]) : 0.1;

	const filterPath = args.find(
		(a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--threshold"
	);

	const project = new Project({
		tsConfigFilePath: "tsconfig.json",
		skipAddingFilesFromTsConfig: false,
	});

	const files = project
		.getSourceFiles()
		.filter((f) => {
			const path = f.getFilePath();
			return (
				!path.includes("node_modules") &&
				!path.includes(".next") &&
				!path.includes(".source") &&
				!path.includes(".open-next") &&
				!path.includes("cloudflare-env.d.ts") &&
				(filterPath ? path.includes(filterPath) : true)
			);
		})
		.filter((f) => f.getEndLineNumber() > 10);

	const reports = files.map(measureFile).sort((a, b) => a.ldr - b.ldr);

	const lowDensity = reports.filter((r) => r.ldr < threshold);
	const avgLdr = reports.reduce((sum, r) => sum + r.ldr, 0) / reports.length || 0;

	console.log("=== Logic Density Ratio (LDR) Report ===\n");
	console.log(`Files analyzed: ${reports.length}`);
	console.log(`Average LDR:    ${avgLdr.toFixed(3)}`);
	console.log(`Threshold:      ${threshold}`);
	console.log(`Below threshold: ${lowDensity.length}\n`);

	if (lowDensity.length > 0) {
		console.log("--- Low Density Files (potential AI slop) ---\n");
		for (const r of lowDensity) {
			console.log(`  ${r.ldr.toFixed(3)}  ${r.totalLines.toString().padStart(4)}L  ${r.path}`);
		}
		console.log();
	}

	if (verbose) {
		console.log("--- All Files ---\n");
		for (const r of reports) {
			const marker = r.ldr < threshold ? " !" : "  ";
			console.log(
				`${marker} ${r.ldr.toFixed(3)}  ${r.totalLines.toString().padStart(4)}L  ${r.path}`
			);
		}
		console.log();
	}

	const buckets = {
		"0.00-0.05 (very low)": 0,
		"0.05-0.10 (low)": 0,
		"0.10-0.20 (moderate)": 0,
		"0.20-0.30 (good)": 0,
		"0.30+     (dense)": 0,
	};

	for (const r of reports) {
		if (r.ldr < 0.05) buckets["0.00-0.05 (very low)"]++;
		else if (r.ldr < 0.1) buckets["0.05-0.10 (low)"]++;
		else if (r.ldr < 0.2) buckets["0.10-0.20 (moderate)"]++;
		else if (r.ldr < 0.3) buckets["0.20-0.30 (good)"]++;
		else buckets["0.30+     (dense)"]++;
	}

	console.log("--- Distribution ---\n");
	for (const [label, count] of Object.entries(buckets)) {
		const bar = "#".repeat(Math.round((count / reports.length) * 40));
		console.log(`  ${label}: ${count.toString().padStart(3)} ${bar}`);
	}
	console.log();

	if (lowDensity.length > 0) {
		process.exit(1);
	}
}

main();
