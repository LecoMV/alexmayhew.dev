export interface Post {
	slug: string;
	data: {
		title: string;
		description: string;
		publishedAt: Date;
		category: string;
		tags: string[];
		image?: string;
		isHub?: boolean;
		series?: string;
	};
}
