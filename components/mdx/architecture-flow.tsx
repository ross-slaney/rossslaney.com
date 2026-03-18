interface ArchitectureFlowProps {
  title?: string;
}

const steps = [
  {
    eyebrow: "Source",
    title: "Next.js App",
    body: "Your App Router project, Dockerfile, and content live in one repo.",
  },
  {
    eyebrow: "Infrastructure",
    title: "Bicep Layers",
    body: "A foundation layer creates shared Azure primitives, then an applications layer deploys the running app.",
  },
  {
    eyebrow: "Delivery",
    title: "GitHub Actions",
    body: "Push to main, build the image, deploy the infra, and wire the app to the platform outputs.",
  },
  {
    eyebrow: "Runtime",
    title: "Azure Container Apps",
    body: "Container Apps runs the image, Managed Identity pulls from ACR, and DNS points the domain at the environment.",
  },
];

export function ArchitectureFlow({
  title = "The Delivery Pattern",
}: ArchitectureFlowProps) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-gradient-to-br from-background to-muted/40 p-6">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Architecture
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          A simple pattern for shipping a containerized Next.js app without
          hiding the platform details behind a black box.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative rounded-xl border border-border bg-background/90 p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
              {step.eyebrow}
            </p>
            <h4 className="mt-2 text-lg font-semibold text-foreground">
              {index + 1}. {step.title}
            </h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
