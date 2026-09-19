"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { Book, FilterStatus, ReadingStatus, StatCounts } from "@/lib/types";
import { fetchBooks, addBook, updateBookStatus, deleteBook, getVisibleBooks } from "@/lib/storage";
import Header from "@/components/Header";
import WelcomeBanner from "@/components/WelcomeBanner";
import StatsBar from "@/components/StatsBar";
import Toolbar from "@/components/Toolbar";
import BookGrid from "@/components/BookGrid";
import AddBookModal from "@/components/AddBookModal";
import AnimatedFooter from "@/components/AnimatedFooter";
import WaveGridBackground from "@/components/WaveGridBackground";
import PerspectiveCarousel from "@/components/PerspectiveCarousel";
import { Sparkles, Compass, Loader2 } from "lucide-react";
import KineticTextLoader from "@/components/ui/kinetic-text-loader";

export default function ShelflyDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load books from Supabase on mount
  useEffect(() => {
    async function load() {
      const { data, error } = await fetchBooks();
      if (error) {
        setLoadError(error);
      } else if (data) {
        setBooks(data);
      }
      setIsLoaded(true);
    }
    load();
  }, []);

  // Derive counts
  const stats: StatCounts = useMemo(() => {
    return {
      total: books.length,
      want_to_read: books.filter((b) => b.status === "want_to_read").length,
      reading: books.filter((b) => b.status === "reading").length,
      finished: books.filter((b) => b.status === "finished").length,
    };
  }, [books]);

  // Derive visible books according to search + filter
  const visibleBooks = useMemo(() => {
    return getVisibleBooks(books, activeFilter, searchQuery);
  }, [books, activeFilter, searchQuery]);

  // Derive books for perspective carousel
  const carouselItems = useMemo(() => {
    const readingBooks = books.filter((b) => b.status === "reading");
    const displayList = readingBooks.length > 0 ? readingBooks : books.slice(0, 6);
    return displayList.map((b) => ({
      src:
        b.coverImage ||
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
      title: b.title,
      author: b.author,
      status: b.status,
    }));
  }, [books]);

  // Add Book
  const handleAddBook = async (bookData: {
    title: string;
    author: string;
    coverImage?: string;
    status: ReadingStatus;
  }) => {
    const { data, error } = await addBook(bookData);
    if (error) {
      // Surface error — could add an error state to the modal
      console.error("Failed to add book:", error);
      return;
    }
    if (data) {
      setBooks((prev) => [data, ...prev]);
      if (data.status === "finished") {
        triggerConfetti();
      }
    }
  };

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: ReadingStatus) => {
    const { error } = await updateBookStatus(id, newStatus);
    if (error) {
      console.error("Failed to update status:", error);
      return;
    }
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (newStatus === "finished") {
      triggerConfetti();
    }
  };

  // Delete Book
  const handleDeleteBook = async (id: string) => {
    const { error } = await deleteBook(id);
    if (error) {
      console.error("Failed to delete book:", error);
      return;
    }
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  // Celebration Confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.7 },
        colors: ["#ff6f1e", "#22c55e", "#3b82f6", "#2b1a07"],
      });
    } catch {
      // Ignore in environments without canvas support
    }
  };

  // Loading skeleton
  if (!isLoaded) {
    return (
      <div className="relative min-h-screen bg-cream-paper flex flex-col justify-between overflow-x-hidden">
        <div className="absolute top-0 inset-x-0 h-[520px] opacity-25 pointer-events-none z-0">
          <WaveGridBackground
            gridSize={24}
            colorBase="#fdfbf9"
            colorHigh="#ff6f1e"
            waveAmplitude={0.25}
            waveSpeed={3.5}
            className="w-full h-full"
          />
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <Header onOpenAddModal={() => {}} />
          <main className="flex-1 flex items-center justify-center">
            <KineticTextLoader aria-label="Loading your shelf" />
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="relative min-h-screen bg-cream-paper flex flex-col justify-between overflow-x-hidden">
        <div className="relative z-10 flex-1 flex flex-col">
          <Header onOpenAddModal={() => {}} />
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="font-serif-literary text-2xl font-bold text-cocoa-ink mb-2">
                something went wrong.
              </h2>
              <p className="font-sans text-sm text-charcoal/70 mb-4 max-w-md">{loadError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="pill-button"
              >
                try again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-cream-paper flex flex-col justify-between overflow-x-hidden">
      {/* Subtle Three.js Wave Grid Ambient Layer at top */}
      <div className="absolute top-0 inset-x-0 h-[520px] opacity-25 pointer-events-none z-0">
        <WaveGridBackground
          gridSize={24}
          colorBase="#fdfbf9"
          colorHigh="#ff6f1e"
          waveAmplitude={0.25}
          waveSpeed={3.5}
          className="w-full h-full"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Header onOpenAddModal={() => setIsAddModalOpen(true)} />

        <main className="flex-1 pb-16">
          <WelcomeBanner />

          <StatsBar
            stats={stats}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Perspective Spotlight Carousel: Highlight current active reading journey */}
          {carouselItems.length > 0 && (
            <section className="w-full max-w-[1200px] mx-auto px-6 py-6" aria-label="Reading Spotlight">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#ff6f1e]/15 flex items-center justify-center text-marker-orange">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="font-serif-literary text-xl font-bold text-cocoa-ink lowercase tracking-tight">
                    currently turning pages & spotlight.
                  </h2>
                </div>
                <span className="text-xs font-sans text-charcoal/60 hidden sm:inline">
                  3D perspective &bull; arrow keys or drag
                </span>
              </div>

              <div className="relative h-[320px] w-full rounded-[16px] border border-charcoal/10 bg-dew-drop/60 p-4 shadow-2xs overflow-hidden">
                <PerspectiveCarousel
                  items={carouselItems}
                  slideWidth={180}
                  rotationStep={40}
                  inactiveScale={0.82}
                />
              </div>
            </section>
          )}

          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {isLoaded && (
            <BookGrid
              books={visibleBooks}
              totalBooksCount={books.length}
              activeFilter={activeFilter}
              searchQuery={searchQuery}
              onUpdateStatus={handleUpdateStatus}
              onDeleteBook={handleDeleteBook}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onResetFilters={() => {
                setActiveFilter("all");
                setSearchQuery("");
              }}
            />
          )}
        </main>
      </div>

      {/* Animated ASCII Canvas Footer */}
      <AnimatedFooter
        headingLines={["shelfly."]}
        background="#ff6f1e"
        textColor="#fdfbf9"
        charColor="#ce500a"
        hoverColor="#ffffff"
        hoverCharColor="#ff6f1e"
      />

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBook={handleAddBook}
      />
    </div>
  );
}
