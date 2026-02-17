"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export default function PaginationControls({ meta }: PaginationControlsProps) {
  const { limit: pageSize, page: currentPage, total, totalPages } = meta;
  const searchParams = useSearchParams();
  const router = useRouter();

  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/meals?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Results Info */}
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{start}</span> to{" "}
          <span className="font-semibold text-gray-900">{end}</span> of{" "}
          <span className="font-semibold text-gray-900">{total}</span> results
        </p>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          {/* First */}
          <button
            onClick={() => navigateToPage(1)}
            disabled={currentPage === 1}
            className="hidden sm:flex p-2 rounded-lg border border-gray-200 hover:border-orange-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 hover:border-orange-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, idx) => (
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => navigateToPage(page as number)}
                  className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? "bg-orange-500 text-white"
                      : "border border-gray-200 hover:border-orange-500 hover:text-orange-600"
                  }`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Mobile Indicator */}
          <span className="sm:hidden text-sm font-medium px-3">
            {currentPage} / {totalPages}
          </span>

          {/* Next */}
          <button
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:border-orange-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last */}
          <button
            onClick={() => navigateToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="hidden sm:flex p-2 rounded-lg border border-gray-200 hover:border-orange-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}