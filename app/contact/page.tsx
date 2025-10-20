import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Ross Slaney",
};

export default function ContactPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities? I'd love to
            hear from you.
          </p>
        </header>

        <div className="flex flex-col items-center gap-8">
          {/* Email Graphic */}
          <div className="relative w-full max-w-md">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl rotate-2 transform"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-muted to-muted/50 rounded-3xl -rotate-2 transform"></div>

            {/* Main email card */}
            <div className="relative bg-muted/30 border-2 border-border rounded-2xl p-8 sm:p-12 shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
              {/* Envelope Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Decorative dots */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-150"></div>

                  {/* Envelope SVG */}
                  <svg
                    className="w-24 h-24 sm:w-32 sm:h-32 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Email address */}
              <div className="text-center space-y-3">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Email Me At
                </p>
                <a
                  href="mailto:me@rossslaney.com"
                  className="block text-xl sm:text-2xl font-semibold text-foreground hover:text-primary transition-colors break-all"
                >
                  me@rossslaney.com
                </a>
              </div>

              {/* Action button */}
              <div className="mt-8 flex justify-center">
                <a
                  href="mailto:me@rossslaney.com"
                  className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>

          {/* Additional contact info */}
          <div className="w-full max-w-md">
            <div className="bg-muted/20 border border-border rounded-xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You can also find me on
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://www.linkedin.com/in/rossslaney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/ross-slaney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
