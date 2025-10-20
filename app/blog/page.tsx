import { searchBlogAction } from "@/app/actions/blog";
import { BlogCard } from "@/components/blog-card";
import { BlogSearch } from "@/components/blog-search";
import { BlogCategories } from "@/components/blog-categories";
import { BlogPagination } from "@/components/blog-pagination";

interface BlogPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const category = params.category || "all";
  const page = parseInt(params.page || "1", 10);

  const result = await searchBlogAction({
    query,
    category,
    page,
    itemsPerPage: 9,
    lang: "en",
  });

  return (
    <div className="flex flex-col px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-foreground">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Insights on software engineering, cloud architecture, and modern web
            development
          </p>
        </header>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Blog Categories
            </h2>
            <BlogCategories
              categories={result.categories}
              selectedCategory={result.selectedCategory}
            />
          </div>

          <div className="lg:w-80">
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Search Blogs
            </h2>
            <BlogSearch initialQuery={result.searchQuery} />
          </div>
        </div>

        <div className="mb-8 border-t border-border"></div>

        {/* Results Info */}
        {(result.searchQuery || result.selectedCategory !== "all") && (
          <div className="mb-6 text-sm text-muted-foreground">
            Found {result.totalItems} result{result.totalItems !== 1 ? "s" : ""}
            {result.searchQuery && ` for "${result.searchQuery}"`}
            {result.selectedCategory !== "all" &&
              ` in ${result.selectedCategory}`}
          </div>
        )}

        {/* Blog Posts Grid */}
        {result.items.length > 0 ? (
          <>
            <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((post) => (
                <BlogCard key={`${post.slug}-${post.lang}`} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {result.totalPages > 1 && (
              <BlogPagination
                currentPage={result.currentPage}
                totalPages={result.totalPages}
              />
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">
              No blog posts found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Blog - Ross Slaney",
  description:
    "Insights on software engineering, cloud architecture, and modern web development",
};
