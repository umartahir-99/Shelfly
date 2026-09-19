"use client";

import React, { useState, useEffect, useRef } from "react";
import { ReadingStatus } from "@/lib/types";
import { X, Sparkles, BookOpen, User, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (bookData: {
    title: string;
    author: string;
    coverImage?: string;
    status: ReadingStatus;
  }) => Promise<void>;
}

export function AddBookModal({ isOpen, onClose, onAddBook }: AddBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<ReadingStatus>("want_to_read");

  const [errors, setErrors] = useState<{ title?: string; author?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setAuthor("");
      setCoverImage("");
      setStatus("want_to_read");
      setErrors({});
      // Focus first input on open
      setTimeout(() => titleInputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; author?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Book title is required.";
    }
    if (!author.trim()) {
      newErrors.author = "Author name is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    await onAddBook({
      title: title.trim(),
      author: author.trim(),
      coverImage: coverImage.trim() || undefined,
      status,
    });
    setSubmitting(false);
    onClose();
  };

  const sampleCovers = [
    { label: "Poetry", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop" },
    { label: "Fiction", url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
    { label: "Classics", url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-book-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 bg-charcoal/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-[12px] bg-cream-paper border border-charcoal/20 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-black/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-dew-drop border border-charcoal/15 text-charcoal mb-2">
            <Sparkles className="w-3.5 h-3.5 text-marker-orange" />
            new entry
          </div>
          <h2
            id="add-book-title"
            className="font-serif-literary text-2xl sm:text-3xl font-bold text-cocoa-ink tracking-tight lowercase"
          >
            add book to shelf.
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/65 mt-1 font-sans">
            capture the book details below. It will appear on your shelf immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Title Field */}
          <div>
            <label htmlFor="book-title" className="block text-xs font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Title <span className="text-marker-orange">*</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
              <input
                ref={titleInputRef}
                id="book-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="e.g. The Remains of the Day"
                className={cn(
                  "w-full pl-9 pr-3 py-2 rounded-[8px] border text-sm font-sans bg-cream-paper focus:outline-none focus:bg-dew-drop transition-colors",
                  errors.title
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-charcoal/25 focus:border-charcoal"
                )}
              />
            </div>
            {errors.title && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Author Field */}
          <div>
            <label htmlFor="book-author" className="block text-xs font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Author <span className="text-marker-orange">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
              <input
                id="book-author"
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
                }}
                placeholder="e.g. Kazuo Ishiguro"
                className={cn(
                  "w-full pl-9 pr-3 py-2 rounded-[8px] border text-sm font-sans bg-cream-paper focus:outline-none focus:bg-dew-drop transition-colors",
                  errors.author
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-charcoal/25 focus:border-charcoal"
                )}
              />
            </div>
            {errors.author && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.author}</p>
            )}
          </div>

          {/* Cover Image URL Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="book-cover" className="block text-xs font-semibold uppercase tracking-wider text-charcoal/80">
                Cover Image URL <span className="text-charcoal/40 font-normal lowercase">(optional)</span>
              </label>
            </div>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" />
              <input
                id="book-cover"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://... (leave empty for custom typographic jacket)"
                className="w-full pl-9 pr-3 py-2 rounded-[8px] border border-charcoal/25 text-sm font-sans bg-cream-paper focus:outline-none focus:border-charcoal focus:bg-dew-drop transition-colors"
              />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-charcoal/60">
              <span>Quick samples:</span>
              {sampleCovers.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setCoverImage(s.url)}
                  className="underline text-charcoal/80 hover:text-marker-orange"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Status Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/80 mb-1.5">
              Initial Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "want_to_read" as ReadingStatus, label: "Want to Read" },
                { id: "reading" as ReadingStatus, label: "Reading" },
                { id: "finished" as ReadingStatus, label: "Finished" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id)}
                  className={cn(
                    "py-2 px-2 text-xs font-medium rounded-[8px] border transition-all text-center",
                    status === s.id
                      ? "border-charcoal bg-dew-drop text-cocoa-ink font-semibold shadow-xs"
                      : "border-charcoal/20 bg-cream-paper text-charcoal/70 hover:border-charcoal/40"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-charcoal/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-sans text-charcoal/70 hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "pill-button text-sm py-2 px-6",
                submitting && "opacity-60 cursor-not-allowed"
              )}
              id="submit-add-book-btn"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>adding...</span>
                </>
              ) : (
                "add to shelf"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;
