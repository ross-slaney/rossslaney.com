"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function BlogPagination({
  currentPage,
  totalPages,
}: BlogPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }

      router.push(`/blog?${params.toString()}`);
    });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (showEllipsisStart) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (showEllipsisEnd) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              disabled={isPending}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-muted"
              } disabled:opacity-50`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
