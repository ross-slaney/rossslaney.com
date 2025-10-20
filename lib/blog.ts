import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface BlogPost {
  slug: string;
  lang: string;
  title: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  authorPhoto: string;
  previewImage: string;
  category: string;
  excerpt: string;
  content: string;
  readingTime: string;
}

export interface BlogPostMetadata
  extends Omit<BlogPost, "content" | "readingTime"> {
  readingTime: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Get all blog post directories
 */
export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }
  return fs.readdirSync(CONTENT_DIR).filter((file) => {
    const fullPath = path.join(CONTENT_DIR, file);
    return fs.statSync(fullPath).isDirectory();
  });
}

/**
 * Get available languages for a specific blog post
 */
export function getAvailableLanguages(slug: string): string[] {
  const postDir = path.join(CONTENT_DIR, slug);
  if (!fs.existsSync(postDir)) {
    return [];
  }
  return fs
    .readdirSync(postDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(".mdx", ""));
}

/**
 * Read and parse a single blog post
 */
export function getBlogPost(
  slug: string,
  lang: string = "en"
): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, slug, `${lang}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    lang,
    title: data.title || "",
    publishedAt: data.publishedAt || "",
    updatedAt: data.updatedAt || "",
    author: data.author || "",
    authorPhoto: data.authorPhoto || "",
    previewImage: data.previewImage || "",
    category: data.category || "",
    excerpt: data.excerpt || "",
    content,
    readingTime: stats.text,
  };
}

/**
 * Get all blog posts metadata (without full content)
 */
export function getAllBlogPosts(lang: string = "en"): BlogPostMetadata[] {
  const slugs = getAllBlogSlugs();
  const posts: BlogPostMetadata[] = [];

  for (const slug of slugs) {
    const languages = getAvailableLanguages(slug);
    if (languages.includes(lang)) {
      const post = getBlogPost(slug, lang);
      if (post) {
        const { content, ...metadata } = post;
        posts.push(metadata);
      }
    }
  }

  // Sort by published date, newest first
  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get all unique categories
 */
export function getAllCategories(lang: string = "en"): string[] {
  const posts = getAllBlogPosts(lang);
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}

/**
 * Search blog posts by query and filter by category
 */
export function searchBlogPosts(
  query: string = "",
  category: string = "",
  lang: string = "en"
): BlogPostMetadata[] {
  let posts = getAllBlogPosts(lang);

  // Filter by category
  if (category && category !== "all") {
    posts = posts.filter((post) => post.category === category);
  }

  // Search by query (fuzzy search in title, excerpt, and content)
  if (query) {
    const lowerQuery = query.toLowerCase();
    posts = posts.filter((post) => {
      // Get full content for search
      const fullPost = getBlogPost(post.slug, lang);
      if (!fullPost) return false;

      return (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        fullPost.content.toLowerCase().includes(lowerQuery) ||
        post.category.toLowerCase().includes(lowerQuery)
      );
    });
  }

  return posts;
}

/**
 * Paginate blog posts
 */
export interface PaginatedResults<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function paginatePosts<T>(
  posts: T[],
  page: number = 1,
  itemsPerPage: number = 9
): PaginatedResults<T> {
  const totalItems = posts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const items = posts.slice(startIndex, endIndex);

  return {
    items,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  };
}
