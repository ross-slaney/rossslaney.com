"use server";

import {
  getAllCategories,
  searchBlogPosts,
  paginatePosts,
  type BlogPostMetadata,
  type PaginatedResults,
} from "@/lib/blog";

export interface BlogSearchParams {
  query?: string;
  category?: string;
  page?: number;
  itemsPerPage?: number;
  lang?: string;
}

export interface BlogSearchResult extends PaginatedResults<BlogPostMetadata> {
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
}

/**
 * Server action to search and filter blog posts with pagination
 */
export async function searchBlogAction(
  params: BlogSearchParams = {}
): Promise<BlogSearchResult> {
  const {
    query = "",
    category = "all",
    page = 1,
    itemsPerPage = 9,
    lang = "en",
  } = params;

  // Get all categories for filters
  const categories = getAllCategories(lang);

  // Search and filter posts
  const filteredPosts = searchBlogPosts(query, category, lang);

  // Paginate results
  const paginatedResults = paginatePosts(filteredPosts, page, itemsPerPage);

  return {
    ...paginatedResults,
    categories,
    selectedCategory: category,
    searchQuery: query,
  };
}

/**
 * Server action to get all categories
 */
export async function getCategoriesAction(
  lang: string = "en"
): Promise<string[]> {
  return getAllCategories(lang);
}
