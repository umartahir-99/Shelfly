"use client";

import React from "react";
import { Book, ReadingStatus, FilterStatus } from "@/lib/types";
import BookCard from "./BookCard";
import EmptyState from "./EmptyState";

interface BookGridProps {
  books: Book[];
  totalBooksCount: number;
  activeFilter: FilterStatus;
  searchQuery: string;
  onUpdateStatus: (id: string, newStatus: ReadingStatus) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
  onOpenAddModal: () => void;
  onResetFilters: () => void;
}

export function BookGrid({
  books,
  totalBooksCount,
  activeFilter,
  searchQuery,
  onUpdateStatus,
  onDeleteBook,
  onOpenAddModal,
  onResetFilters,
}: BookGridProps) {
  if (totalBooksCount === 0) {
    return (
      <EmptyState
        type="no_books"
        onOpenAddModal={onOpenAddModal}
        onResetFilters={onResetFilters}
      />
    );
  }

  if (books.length === 0) {
    if (searchQuery.trim()) {
      return (
        <EmptyState
          type="no_search"
          onOpenAddModal={onOpenAddModal}
          onResetFilters={onResetFilters}
        />
      );
    }
    const filterLabels: Record<string, string> = {
      want_to_read: "Want to Read",
      reading: "Currently Reading",
      finished: "Finished",
    };
    return (
      <EmptyState
        type="no_filter"
        currentFilterLabel={filterLabels[activeFilter] || activeFilter}
        onOpenAddModal={onOpenAddModal}
        onResetFilters={onResetFilters}
      />
    );
  }

  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 py-6" aria-label="Book Collection">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onUpdateStatus={onUpdateStatus}
            onDeleteBook={onDeleteBook}
          />
        ))}
      </div>
    </section>
  );
}

export default BookGrid;
