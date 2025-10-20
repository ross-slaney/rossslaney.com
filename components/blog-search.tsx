"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface BlogSearchProps {
  initialQuery?: string;
}

export function BlogSearch({ initialQuery = "" }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }

      // Reset to first page on new search
      params.delete("page");

      router.push(`/blog?${params.toString()}`);
    });
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pl-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
