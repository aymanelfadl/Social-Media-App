export default function Profile() {
	return (
		<div>
			<div className="relative h-48 bg-neutral-200 dark:bg-neutral-800">
				{/* Banner placeholder */}
			</div>
			<div className="px-4">
				<div className="-mt-12 flex items-end justify-between">
					<div className="flex items-end gap-3">
						<div className="h-24 w-24 rounded-full border-4 border-[var(--color-background)] bg-neutral-300" />
						<div>
							<h1 className="text-xl font-bold leading-tight">You</h1>
							<p className="text-neutral-500">@you</p>
						</div>
					</div>
					<button className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900">
						Edit profile
					</button>
				</div>

				<div className="mt-4">
					<p className="text-sm text-neutral-700 dark:text-neutral-300">
						Bio goes here. Building web apps with Next.js.
					</p>
					<div className="mt-2 text-sm text-neutral-500">
						123 Following · 4,567 Followers
					</div>
				</div>

				<div className="mt-4 border-b border-neutral-200 dark:border-neutral-800">
					<ul className="flex">
						{['Posts', 'Replies', 'Media', 'Likes'].map((t) => (
							<li
								key={t}
								className="flex-1 cursor-pointer py-3 text-center hover:bg-neutral-50 dark:hover:bg-neutral-900"
							>
								<span className="text-sm font-medium">{t}</span>
							</li>
						))}
					</ul>
				</div>

				<div>
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="border-b border-neutral-200 dark:border-neutral-800 p-4"
						>
							Profile post {i + 1}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}