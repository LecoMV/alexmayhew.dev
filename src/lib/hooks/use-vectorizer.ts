"use client";

import { useState, useCallback, useRef } from "react";

export type VectorizerStatus =
	| "idle"
	| "uploading"
	| "uploaded"
	| "processing"
	| "completed"
	| "error";

export type Generator = "potrace" | "vtracer";

export interface ProcessingResult {
	success: boolean;
	final_svg?: string;
	stages?: {
		upscale?: { duration: number };
		generate?: { duration: number };
		optimize?: { duration: number };
	};
	total_duration?: number;
	generator?: string;
	preset?: string;
	quality?: {
		dino_score: number;
		tier: string;
	};
}

export interface VectorizerState {
	status: VectorizerStatus;
	taskId: string | null;
	progress: string[];
	result: ProcessingResult | null;
	error: string | null;
	previewUrl: string | null;
	svgContent: string | null;
}

export interface ProcessOptions {
	generator: Generator;
	preset: string;
	remove_background?: boolean;
	calculate_quality?: boolean;
}

const initialState: VectorizerState = {
	status: "idle",
	taskId: null,
	progress: [],
	result: null,
	error: null,
	previewUrl: null,
	svgContent: null,
};

export function useVectorizer() {
	const [state, setState] = useState<VectorizerState>(initialState);
	const pollingRef = useRef<NodeJS.Timeout | null>(null);

	const reset = useCallback(() => {
		if (pollingRef.current) {
			clearInterval(pollingRef.current);
			pollingRef.current = null;
		}
		if (state.previewUrl) {
			URL.revokeObjectURL(state.previewUrl);
		}
		setState(initialState);
	}, [state.previewUrl]);

	const upload = useCallback(async (file: File) => {
		setState((prev) => ({
			...prev,
			status: "uploading",
			error: null,
			progress: ["Uploading image..."],
			previewUrl: URL.createObjectURL(file),
		}));

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/vectorize", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = (await response.json()) as { error?: string };
				throw new Error(errorData.error || "Upload failed");
			}

			const data = (await response.json()) as { task_id: string };
			setState((prev) => ({
				...prev,
				status: "uploaded",
				taskId: data.task_id,
				progress: [...prev.progress, "Upload complete. Ready to vectorize."],
			}));

			return data.task_id;
		} catch (error) {
			const message = error instanceof Error ? error.message : "Upload failed";
			setState((prev) => ({
				...prev,
				status: "error",
				error: message,
				progress: [...prev.progress, `Error: ${message}`],
			}));
			return null;
		}
	}, []);

	const pollStatus = useCallback(async (taskId: string): Promise<boolean> => {
		try {
			const response = await fetch(`/api/vectorize/${taskId}/status`);
			if (!response.ok) {
				throw new Error("Status check failed");
			}

			const data = (await response.json()) as {
				status: string;
				logs?: string[];
				result?: ProcessingResult;
			};

			// Update progress logs
			const logs = data.logs;
			if (logs && logs.length > 0) {
				setState((prev) => {
					const existingLogs = new Set(prev.progress);
					const newLogs = logs.filter((log: string) => !existingLogs.has(log));
					if (newLogs.length === 0) return prev;
					return {
						...prev,
						progress: [...prev.progress, ...newLogs],
					};
				});
			}

			if (data.status === "SUCCESS" && data.result) {
				const result = data.result;
				setState((prev) => ({
					...prev,
					status: "completed",
					result,
					progress: [...prev.progress, "Vectorization complete!"],
				}));
				return true;
			}

			if (data.status === "FAILURE") {
				setState((prev) => ({
					...prev,
					status: "error",
					error: "Vectorization failed",
					progress: [...prev.progress, "Error: Vectorization failed"],
				}));
				return true;
			}

			return false;
		} catch (error) {
			console.error("Status poll error:", error);
			return false;
		}
	}, []);

	const process = useCallback(
		async (taskId: string, options: ProcessOptions) => {
			setState((prev) => ({
				...prev,
				status: "processing",
				progress: [
					...prev.progress,
					`Starting vectorization with ${options.generator} (${options.preset})...`,
				],
			}));

			try {
				const response = await fetch(`/api/vectorize/${taskId}/process`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(options),
				});

				if (!response.ok) {
					const errorData = (await response.json()) as { error?: string };
					throw new Error(errorData.error || "Process request failed");
				}

				// Start polling for status
				pollingRef.current = setInterval(async () => {
					const done = await pollStatus(taskId);
					if (done && pollingRef.current) {
						clearInterval(pollingRef.current);
						pollingRef.current = null;
					}
				}, 2000);
			} catch (error) {
				const message = error instanceof Error ? error.message : "Process failed";
				setState((prev) => ({
					...prev,
					status: "error",
					error: message,
					progress: [...prev.progress, `Error: ${message}`],
				}));
			}
		},
		[pollStatus]
	);

	const downloadSvg = useCallback(async () => {
		if (!state.taskId) return null;

		try {
			const response = await fetch(`/api/vectorize/${state.taskId}/download/input_final.svg`);
			if (!response.ok) {
				throw new Error("Download failed");
			}

			const svgContent = await response.text();
			setState((prev) => ({ ...prev, svgContent }));

			// Create download blob
			const blob = new Blob([svgContent], { type: "image/svg+xml" });
			const url = URL.createObjectURL(blob);

			// Trigger download
			const a = document.createElement("a");
			a.href = url;
			a.download = "vectorized.svg";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			return svgContent;
		} catch (error) {
			console.error("Download error:", error);
			return null;
		}
	}, [state.taskId]);

	const getSvgPreview = useCallback(async () => {
		if (!state.taskId || state.svgContent) return state.svgContent;

		try {
			const response = await fetch(`/api/vectorize/${state.taskId}/download/input_final.svg`);
			if (!response.ok) {
				throw new Error("Preview failed");
			}

			const svgContent = await response.text();
			setState((prev) => ({ ...prev, svgContent }));
			return svgContent;
		} catch (error) {
			console.error("Preview error:", error);
			return null;
		}
	}, [state.taskId, state.svgContent]);

	return {
		...state,
		upload,
		process,
		reset,
		downloadSvg,
		getSvgPreview,
	};
}
