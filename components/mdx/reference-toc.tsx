interface ReferenceTocItem {
  href: string;
  label: string;
}

interface ReferenceTocProps {
  title?: string;
  items: ReferenceTocItem[];
}

export function ReferenceToc({
  title = "Table of Contents",
  items,
}: ReferenceTocProps) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-muted/40 p-6">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Reference Guide
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">{title}</h2>
      </div>

      <nav aria-label={title}>
        <ol className="grid gap-3 md:grid-cols-2">
          {items.map((item, index) => (
            <li key={item.href} className="list-none">
              <a
                href={item.href}
                className="group flex h-full items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="mt-0.5 text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-6 text-foreground group-hover:text-primary">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
