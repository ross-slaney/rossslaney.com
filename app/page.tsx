import Image from "next/image";

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
  {
    label: "GitHub",
    href: "https://github.com/ross-slaney",
    className:
      "border border-border text-foreground hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  },
] as const;

const skills = [
  "Azure Cloud Solutions",
  ".NET Development",
  "Next.js Applications",
  "Expo React Native",
  "DevOps & CI/CD",
  "Full-Stack Development",
] as const;

const certifications = [
  {
    title: "Microsoft Certified: DevOps Engineer Expert",
    description:
      "Expert-level certification in DevOps practices, CI/CD, and Azure DevOps",
    url: "https://learn.microsoft.com/api/credentials/share/en-us/RossSlaney-8321/3AE68FC0403E7474?sharingId=7700072A9F5BBD45",
  },
  {
    title: "Microsoft Certified: Azure Developer Associate",
    description:
      "Proficiency in designing, building, and maintaining Azure cloud applications",
    url: "https://learn.microsoft.com/api/credentials/share/en-us/RossSlaney-8321/7A499FE3F84803A4?sharingId=7700072A9F5BBD45",
  },
  {
    title: "Microsoft Certified: Azure AI Engineer Associate",
    description:
      "Proficiency designing and implementing Azure AI solutions using Azure AI services, Azure AI Search, and Azure Open AI.",
    url: "https://learn.microsoft.com/en-us/users/rossslaney-8321/credentials/2b5653c6c36aeffd",
  },
] as const;

export default function Home() {
  return (
    <div className="flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col-reverse sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
          <div className="flex flex-col gap-3 flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Ross Slaney
            </p>
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              Full Stack Software Engineer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Specializing in Azure cloud solutions, .NET development, Next.js,
              and Expo React Native. Microsoft certified expert in DevOps and
              Azure development with experience building scalable,
              enterprise-grade solutions.
            </p>
          </div>

          <div className="relative flex-shrink-0">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
              {/* Cartoon-style decorative border layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-[3rem] rotate-3 transform transition-transform hover:rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-muted to-muted/50 rounded-[3rem] -rotate-3 transform transition-transform hover:-rotate-6"></div>

              {/* Image container with cartoon border */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-primary/30 shadow-2xl transform transition-transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <Image
                  src="https://files.rossslaney.com/assets/ross.png"
                  alt="Ross Slaney"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Fun decorative dots */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-primary/60 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
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

        {/* Skills Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Specializations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div
                key={skill}
                className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground text-center"
              >
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Microsoft Certifications
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {certifications.map((cert) => (
              <a
                key={cert.title}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-muted/30 border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors group"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {cert.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cert.description}
                </p>
                <div className="mt-3 text-xs text-primary font-medium">
                  View Credential →
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
