export function ReadingProgress() {
	return (
		<div
			className="reading-progress-bar fixed top-0 right-0 left-0 z-50 h-[3px]"
			style={{ backgroundColor: "var(--color-cyber-lime)" }}
			role="progressbar"
			aria-label="Reading progress"
		/>
	);
}
