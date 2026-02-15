"use client";

import { AnimatePresence, m } from "framer-motion";
import { AlertCircle, Image as ImageIcon, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface UploadZoneProps {
	onFileSelect: (file: File) => void;
	previewUrl: string | null;
	onClear: () => void;
	disabled?: boolean;
}

const ACCEPTED_TYPES = [
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/webp",
	"image/gif",
	"image/bmp",
];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export function UploadZone({ onFileSelect, previewUrl, onClear, disabled }: UploadZoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const validateFile = useCallback((file: File): string | null => {
		if (!ACCEPTED_TYPES.includes(file.type)) {
			return "Invalid file type. Please upload PNG, JPG, WebP, GIF, or BMP.";
		}
		if (file.size > MAX_SIZE) {
			return "File too large. Maximum size is 20MB.";
		}
		return null;
	}, []);

	const handleFile = useCallback(
		(file: File) => {
			const validationError = validateFile(file);
			if (validationError) {
				setError(validationError);
				return;
			}
			setError(null);
			onFileSelect(file);
		},
		[validateFile, onFileSelect]
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			if (disabled) return;

			const file = e.dataTransfer.files[0];
			if (file) {
				handleFile(file);
			}
		},
		[disabled, handleFile]
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				handleFile(file);
			}
		},
		[handleFile]
	);

	const handleClick = useCallback(() => {
		if (!disabled && inputRef.current) {
			inputRef.current.click();
		}
	}, [disabled]);

	return (
		<div className="relative">
			<input
				ref={inputRef}
				type="file"
				accept={ACCEPTED_TYPES.join(",")}
				onChange={handleInputChange}
				className="hidden"
				disabled={disabled}
			/>

			<AnimatePresence mode="wait">
				{previewUrl ? (
					<m.div
						key="preview"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="bg-void-navy/50 relative aspect-video overflow-hidden border border-white/10"
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={previewUrl} alt="Upload preview" className="h-full w-full object-contain" />
						{!disabled && (
							<button
								onClick={onClear}
								className="bg-void-navy/80 hover:bg-burnt-ember/80 absolute top-3 right-3 border border-white/10 p-2 transition-colors"
								aria-label="Remove image"
							>
								<X className="h-4 w-4" strokeWidth={1.5} />
							</button>
						)}
					</m.div>
				) : (
					<m.div
						key="upload"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClick}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={cn(
							"relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed transition-all duration-300",
							isDragging
								? "border-cyber-lime bg-cyber-lime/5"
								: "hover:border-cyber-lime/50 border-white/20 hover:bg-white/5",
							disabled && "cursor-not-allowed opacity-50"
						)}
					>
						{/* Corner accents */}
						<div
							className={cn(
								"absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2 transition-colors",
								isDragging ? "border-cyber-lime" : "border-white/30"
							)}
						/>
						<div
							className={cn(
								"absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2 transition-colors",
								isDragging ? "border-cyber-lime" : "border-white/30"
							)}
						/>
						<div
							className={cn(
								"absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 transition-colors",
								isDragging ? "border-cyber-lime" : "border-white/30"
							)}
						/>
						<div
							className={cn(
								"absolute right-0 bottom-0 h-6 w-6 border-r-2 border-b-2 transition-colors",
								isDragging ? "border-cyber-lime" : "border-white/30"
							)}
						/>

						<m.div
							animate={{ y: isDragging ? -5 : 0 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						>
							{isDragging ? (
								<ImageIcon className="text-cyber-lime h-12 w-12" strokeWidth={1} />
							) : (
								<Upload className="text-slate-text h-12 w-12" strokeWidth={1} />
							)}
						</m.div>

						<div className="text-center">
							<p className="text-mist-white font-mono text-sm">
								{isDragging ? "Drop your image here" : "Drag & drop or click to upload"}
							</p>
							<p className="text-slate-text mt-1 font-mono text-xs">
								PNG, JPG, WebP, GIF, BMP • Max 20MB
							</p>
						</div>
					</m.div>
				)}
			</AnimatePresence>

			{/* Error message */}
			<AnimatePresence>
				{error && (
					<m.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="text-burnt-ember mt-3 flex items-center gap-2"
					>
						<AlertCircle className="h-4 w-4" strokeWidth={1.5} />
						<span className="font-mono text-xs">{error}</span>
					</m.div>
				)}
			</AnimatePresence>
		</div>
	);
}
