"use client";

import * as Sentry from "@sentry/nextjs";
import { Component } from "react";

import type { ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo): void {
		Sentry.captureException(error, {
			contexts: { react: { componentStack: info.componentStack } },
		});
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return this.props.fallback ?? null;
		}
		return this.props.children;
	}
}
