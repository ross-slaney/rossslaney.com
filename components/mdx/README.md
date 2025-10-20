# Custom MDX Components Guide

This directory contains custom React components that can be used in your MDX blog posts.

## How It Works

### Architecture

1. **Server-Side Rendering (SSR)**: The page is fully rendered on the server for SEO
2. **Client Hydration**: Interactive components (marked with `"use client"`) become interactive after page load
3. **Best of Both Worlds**: SEO-friendly with progressive enhancement

### Adding Custom Components

#### Step 1: Create Your Component

Create a new file in `/components/mdx/`:

```tsx
// components/mdx/my-component.tsx
"use client"; // Only if you need interactivity (state, events, etc.)

interface MyComponentProps {
  title?: string;
}

export function MyComponent({ title = "Default Title" }: MyComponentProps) {
  return (
    <div className="my-6 rounded-lg border border-border p-4">
      <h3 className="font-semibold">{title}</h3>
      {/* Your component content */}
    </div>
  );
}
```

#### Step 2: Register in `mdx-components.tsx`

```tsx
import { MyComponent } from "@/components/mdx/my-component";

export const blogMDXComponents: MDXComponents = {
  MyComponent, // Add your component here
  // ... other components
};
```

#### Step 3: Use in Your MDX Files

```mdx
---
title: "My Blog Post"
---

# My Post

Here's my custom component:

<MyComponent title="Hello from MDX!" />
```

## When to Use "use client"

### ✅ Use "use client" when you need:

- State (`useState`, `useReducer`)
- Effects (`useEffect`)
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `localStorage`, etc.)
- Hooks that depend on the above

### ❌ Don't use "use client" when:

- Component only renders static content
- No interactivity required
- Purely presentational

**Benefits of Server Components:**

- Better performance
- Smaller bundle size
- Better SEO (fully rendered HTML)

## Examples

### Interactive Component (Client)

```tsx
"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

### Static Component (Server)

```tsx
// No "use client" needed

interface QuoteProps {
  text: string;
  author: string;
}

export function Quote({ text, author }: QuoteProps) {
  return (
    <blockquote className="border-l-4 border-primary pl-4 italic">
      <p>{text}</p>
      <footer>— {author}</footer>
    </blockquote>
  );
}
```

## Passing Props

### Simple Props

```mdx
<DemoGraph title="My Custom Title" />
```

### Complex Props (JSON-like)

For complex data, you can pass objects:

```mdx
<DemoGraph
  data={[
    { label: "React", value: 95, color: "#61DAFB" },
    { label: "TypeScript", value: 90, color: "#3178C6" },
  ]}
/>
```

**Note**: In MDX, props are parsed as expressions, so complex objects work!

## Styling Guidelines

Use Tailwind classes that respect the theme:

- `text-foreground` - Primary text color
- `text-muted-foreground` - Secondary text color
- `bg-background` - Background color
- `bg-muted` - Muted background
- `border-border` - Border color
- `text-primary` - Accent/brand color

These automatically adapt to the user's selected theme (light/dark/blue/green).

## Built-in Components

### DemoGraph

Interactive bar chart visualization.

```mdx
<DemoGraph
  title="My Skills"
  data={[
    { label: "Skill 1", value: 85, color: "#0078D4" },
    { label: "Skill 2", value: 90, color: "#512BD4" },
  ]}
/>
```

### Callout

Styled notification boxes.

```mdx
<Callout type="info" title="Did you know?">
  This is an informational callout!
</Callout>

<Callout type="warning">Be careful with this!</Callout>

<Callout type="success">Great job!</Callout>

<Callout type="error">Something went wrong!</Callout>
```

## Performance Tips

1. **Keep client components small**: Only mark as `"use client"` what absolutely needs it
2. **Lazy load heavy components**: Use dynamic imports for large interactive components
3. **Memoize expensive operations**: Use `useMemo` and `useCallback` in client components
4. **Optimize images**: Use Next.js Image component when needed

## SEO Considerations

✅ **Good for SEO:**

- Server components render fully on the server
- Content is in the HTML source
- No layout shift on hydration

✅ **Still SEO-friendly:**

- Client components with interactive features
- The initial render is still on the server
- Content is crawlable

❌ **Bad for SEO:**

- Loading content only on client-side
- Rendering content based on `useEffect`
- Content behind user interactions

## Troubleshooting

### "Cannot use hooks in server component"

**Solution**: Add `"use client"` directive at the top of your component file.

### Component not found in MDX

**Solution**: Make sure you:

1. Exported the component
2. Added it to `blogMDXComponents` in `mdx-components.tsx`
3. Used the correct component name (case-sensitive)

### Styling doesn't work

**Solution**: Ensure you're using Tailwind classes and the component is rendering in the correct DOM position.

## Resources

- [MDX Documentation](https://mdxjs.com/)
- [Next.js MDX](https://nextjs.org/docs/app/building-your-application/configuring/mdx)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
