import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getBlogPost,
  getAllBlogSlugs,
  getAvailableLanguages,
} from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { blogMDXComponents } from "@/mdx-components";

// Force dynamic rendering (SSR) for all blog posts
export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, lang } = await params;
  const post = getBlogPost(slug, lang);

  if (!post) {
    notFound();
  }

  const formattedPublishedDate = new Date(post.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const formattedUpdatedDate = new Date(post.updatedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="flex flex-col px-4 py-16 sm:px-6 lg:px-8">
      <article className="mx-auto w-full max-w-6xl">
        {/* Back button */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {post.category}
            </span>
            <time dateTime={post.publishedAt} className="text-muted-foreground">
              {formattedPublishedDate}
            </time>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{post.readingTime}</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl">
            {post.title}
          </h1>

          <div className="flex items-center gap-4">
            <Image
              src={post.authorPhoto}
              alt={post.author}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold text-foreground">{post.author}</p>
              {post.publishedAt !== post.updatedAt && (
                <p className="text-sm text-muted-foreground">
                  Updated {formattedUpdatedDate}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative mb-10 h-[400px] w-full overflow-hidden rounded-xl">
          <Image
            src={post.previewImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <MDXRemote source={post.content} components={blogMDXComponents} />
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={post.authorPhoto}
                alt={post.author}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-sm text-muted-foreground">
                  Full Stack Software Engineer
                </p>
              </div>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              View All Posts
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  const params: { slug: string; lang: string }[] = [];

  for (const slug of slugs) {
    const languages = getAvailableLanguages(slug);
    for (const lang of languages) {
      params.push({ slug, lang });
    }
  }

  return params;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug, lang } = await params;
  const post = getBlogPost(slug, lang);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} - Ross Slaney`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.previewImage],
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.previewImage],
    },
  };
}
