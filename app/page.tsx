const primaryLinks = [
  {
    label: "Get in touch",
    href: "mailto:me@rossslaney.com",
    className:
      "bg-neutral-950 text-white hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rossslaney",
    className:
      "border border-neutral-300 text-neutral-900 hover:border-neutral-400 hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-500",
  },
] as const;

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 sm:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-3 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">
            Ross Slaney
          </p>
        </header>
      </div>
    </main>
  );
}
