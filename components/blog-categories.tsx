"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface BlogCategoriesProps {
  categories: string[];
  selectedCategory: string;
}

export function BlogCategories({
  categories,
  selectedCategory,
}: BlogCategoriesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (category === "all") {
        params.delete("category");
      } else {
        params.set("category", category);
      }

      // Reset to first page on category change
      params.delete("page");

      router.push(`/blog?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryChange("all")}
        disabled={isPending}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selectedCategory === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-muted/80"
        } disabled:opacity-50`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          disabled={isPending}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === category
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-muted/80"
          } disabled:opacity-50`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
