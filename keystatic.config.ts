import { config, fields, collection, singleton } from "@keystatic/core";

// Use local storage for dev/build, GitHub for production with proper env vars
const storage =
	process.env.NODE_ENV === "production" && process.env.KEYSTATIC_GITHUB_CLIENT_ID
		? {
				kind: "github" as const,
				repo: {
					owner: "LecoMV",
					name: "alexmayhew.dev",
				},
				branchPrefix: "content/",
			}
		: {
				kind: "local" as const,
			};

export default config({
	storage,

	collections: {
		posts: collection({
			label: "Blog Posts",
			slugField: "title",
			path: "content/blog/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				description: fields.text({
					label: "Description",
					multiline: true,
				}),
				publishedAt: fields.date({
					label: "Published Date",
					defaultValue: { kind: "today" },
				}),
				category: fields.select({
					label: "Category",
					options: [
						{ label: "Engineering", value: "engineering" },
						{ label: "Architecture", value: "architecture" },
						{ label: "DevOps", value: "devops" },
						{ label: "AI/ML", value: "ai-ml" },
					],
					defaultValue: "engineering",
				}),
				tags: fields.array(fields.text({ label: "Tag" }), {
					label: "Tags",
					itemLabel: (props) => props.value,
				}),
				draft: fields.checkbox({
					label: "Draft",
					defaultValue: false,
				}),
				content: fields.mdx({
					label: "Content",
					options: {
						image: {
							directory: "public/blog",
							publicPath: "/blog/",
						},
					},
				}),
			},
		}),
	},

	singletons: {
		settings: singleton({
			label: "Site Settings",
			path: "content/settings",
			schema: {
				siteTitle: fields.text({ label: "Site Title" }),
				tagline: fields.text({ label: "Tagline" }),
				footerText: fields.text({ label: "Footer Text" }),
			},
		}),
	},
});
