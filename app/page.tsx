const primaryLinks = [
  {
    label: "Get in touch",
    href: "mailto:me@rossslaney.com",
    className:
      "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rossslaney",
    className:
      "border border-border text-foreground hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  },
] as const;

export default function Home() {
  return (
    <div className="flex items-center justify-center px-6 py-16 sm:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-3 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Ross Slaney
          </p>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            Software Engineer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Crafting resilient, human-centered digital products with a focus on
            user experience and technical excellence.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4">
          {primaryLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`${link.className} inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-colors`}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
