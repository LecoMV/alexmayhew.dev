"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
	useEffect(() => {
		if (typeof window !== "undefined" && "serviceWorker" in navigator) {
			// Register service worker after page load
			window.addEventListener("load", () => {
				navigator.serviceWorker
					.register("/sw.js")
					.then((registration) => {
						console.log("[SW] Registration successful:", registration.scope);

						// Check for updates
						registration.addEventListener("updatefound", () => {
							const newWorker = registration.installing;
							if (newWorker) {
								newWorker.addEventListener("statechange", () => {
									if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
										// New version available
										console.log("[SW] New version available");
									}
								});
							}
						});
					})
					.catch((error) => {
						console.error("[SW] Registration failed:", error);
					});
			});
		}
	}, []);

	return null;
}
