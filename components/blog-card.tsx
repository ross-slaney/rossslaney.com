import Image from "next/image";
import Link from "next/link";
import type { BlogPostMetadata } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPostMetadata;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
      <Link
        href={`/blog/${post.slug}/${post.lang}`}
        className="relative h-48 w-full overflow-hidden"
      >
        <Image
          src={post.previewImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {post.category}
          </span>
          <time dateTime={post.publishedAt} className="text-muted-foreground">
            {formattedDate}
          </time>
        </div>

        <Link href={`/blog/${post.slug}/${post.lang}`}>
          <h3 className="mb-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </Link>

        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={post.authorPhoto}
              alt={post.author}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium text-foreground">{post.author}</p>
              <p className="text-muted-foreground">{post.readingTime}</p>
            </div>
          </div>

          <Link
            href={`/blog/${post.slug}/${post.lang}`}
            className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}
