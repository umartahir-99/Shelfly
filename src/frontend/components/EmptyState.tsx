"use client";

import React from "react";
import { BookOpen, SearchX, Plus, Sparkles, RefreshCcw } from "lucide-react";

interface EmptyStateProps {
  type: "no_books" | "no_search" | "no_filter";
  onOpenAddModal: () => void;
  onResetFilters: () => void;
  currentFilterLabel?: string;
}

export function EmptyState({
  type,
  onOpenAddModal,
  onResetFilters,
  currentFilterLabel,
}: EmptyStateProps) {
  if (type === "no_books") {
    return (
      <div className="w-full py-16 px-6 text-center flex flex-col items-center justify-center">
        {/* Decorative warm sticker element */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-dew-drop border-2 border-charcoal/20 flex items-center justify-center rotate-3 shadow-xs">
            <BookOpen className="w-9 h-9 text-charcoal/70" />
          </div>
          <span className="absolute -top-2 -right-3 text-2xl rotate-12 select-none">
            ✨
          </span>
        </div>

        <h3 className="font-serif-literary text-2xl sm:text-3xl font-bold text-cocoa-ink">
          no books on your shelf yet.
        </h3>
        <p className="font-sans text-sm sm:text-base text-charcoal/70 mt-2 max-w-md">
          start building your reading sanctuary by adding your very first book.
        </p>

        <div className="mt-4 mb-6 handwritten-caption text-sm">
          <span>&darr; takes less than 30 seconds</span>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="pill-button"
          id="empty-add-first-book-btn"
        >
          <Plus className="w-4 h-4 text-charcoal" />
          <span>+ add your first book</span>
        </button>
      </div>
    );
  }

  if (type === "no_search") {
    return (
      <div className="w-full py-16 px-6 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-dew-drop border border-charcoal/20 flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7 text-charcoal/60" />
        </div>
        <h3 className="font-serif-literary text-2xl font-bold text-cocoa-ink">
          no books match your search.
        </h3>
        <p className="font-sans text-sm text-charcoal/70 mt-1 max-w-sm">
          we couldn&apos;t find any books with that title or author.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-charcoal/25 bg-cream-paper text-xs font-medium text-charcoal hover:bg-dew-drop transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          clear search & filters
        </button>
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-6 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-dew-drop border border-charcoal/20 flex items-center justify-center mb-4 rotate-2">
        <Sparkles className="w-7 h-7 text-marker-orange" />
      </div>
      <h3 className="font-serif-literary text-2xl font-bold text-cocoa-ink">
        no books in &ldquo;{currentFilterLabel}&rdquo; yet.
      </h3>
      <p className="font-sans text-sm text-charcoal/70 mt-1 max-w-sm">
        add a book to this shelf or browse all books.
      </p>
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 rounded-full border border-charcoal/20 bg-cream-paper text-xs font-medium text-charcoal hover:bg-dew-drop transition-colors"
        >
          view all books
        </button>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="pill-button text-xs py-2 px-4"
        >
          <Plus className="w-3.5 h-3.5" />
          + add book
        </button>
      </div>
    </div>
  );
}

export default EmptyState;
