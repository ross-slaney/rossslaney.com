import type { MDXComponents } from "mdx/types";
import { ArchitectureFlow } from "@/components/mdx/architecture-flow";
import { DemoGraph } from "@/components/mdx/demo-graph";
import { Callout } from "@/components/mdx/callout";
import { ReferenceToc } from "@/components/mdx/reference-toc";

// Blog MDX components for styling
export const blogMDXComponents: MDXComponents = {
  // Custom interactive components
  ArchitectureFlow,
  DemoGraph,
  Callout,
  ReferenceToc,
  // Standard HTML elements with styling
  h1: ({ children, className, ...props }) => (
    <h1
      {...props}
      className={`mb-6 text-4xl font-bold text-foreground ${className || ""}`}
    >
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }) => (
    <h2
      {...props}
      className={`mt-10 mb-4 scroll-mt-24 text-3xl font-semibold text-foreground ${className || ""}`}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }) => (
    <h3
      {...props}
      className={`mt-8 mb-3 scroll-mt-24 text-2xl font-semibold text-foreground ${className || ""}`}
    >
      {children}
    </h3>
  ),
  p: ({ children, className, ...props }) => (
    <p
      {...props}
      className={`mb-4 leading-relaxed text-muted-foreground ${className || ""}`}
    >
      {children}
    </p>
  ),
  a: ({ href, children, className, ...props }) => (
    <a
      {...props}
      href={href}
      className={`text-primary hover:underline ${className || ""}`}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children, className, ...props }) => (
    <ul
      {...props}
      className={`mb-4 list-disc space-y-2 pl-6 text-muted-foreground ${className || ""}`}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }) => (
    <ol
      {...props}
      className={`mb-4 list-decimal space-y-2 pl-6 text-muted-foreground ${className || ""}`}
    >
      {children}
    </ol>
  ),
  blockquote: ({ children, className, ...props }) => (
    <blockquote
      {...props}
      className={`my-4 border-l-4 border-primary pl-4 italic text-muted-foreground ${className || ""}`}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, className, ...props }) => (
    <div className="my-6 overflow-x-auto">
      <table
        {...props}
        className={`w-full min-w-[720px] border-collapse overflow-hidden rounded-xl border border-border text-left text-sm ${className || ""}`}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, className, ...props }) => (
    <thead
      {...props}
      className={`bg-muted/80 text-foreground ${className || ""}`}
    >
      {children}
    </thead>
  ),
  tbody: ({ children, className, ...props }) => (
    <tbody
      {...props}
      className={`divide-y divide-border ${className || ""}`}
    >
      {children}
    </tbody>
  ),
  tr: ({ children, className, ...props }) => (
    <tr
      {...props}
      className={`align-top ${className || ""}`}
    >
      {children}
    </tr>
  ),
  th: ({ children, className, ...props }) => (
    <th
      {...props}
      className={`border-b border-border px-4 py-3 font-semibold ${className || ""}`}
    >
      {children}
    </th>
  ),
  td: ({ children, className, ...props }) => (
    <td
      {...props}
      className={`px-4 py-3 leading-6 text-muted-foreground ${className || ""}`}
    >
      {children}
    </td>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
          {children}
        </code>
      );
    }
    return (
      <code
        className={`${className} block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono`}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ""} className="rounded-lg my-6 w-full" />
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...blogMDXComponents,
    ...components,
  };
}
