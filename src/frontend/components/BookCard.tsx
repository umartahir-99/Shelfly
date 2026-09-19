"use client";

import React, { useState } from "react";
import { Book, ReadingStatus } from "@/lib/types";
import { MoreVertical, Trash2, Check, ArrowRight, BookOpen, Clock, Flame, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  onUpdateStatus: (id: string, newStatus: ReadingStatus) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
}

export function BookCard({ book, onUpdateStatus, onDeleteBook }: BookCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Status badge style mapping per design.md §147-151
  const statusConfig = {
    want_to_read: {
      label: "Want to Read",
      icon: Clock,
      className: "border-charcoal/30 text-charcoal bg-dew-drop",
      dotClass: "bg-charcoal/60",
      nextStatus: "reading" as ReadingStatus,
      nextLabel: "Start Reading",
    },
    reading: {
      label: "Reading",
      icon: Flame,
      className: "border-marker-orange text-marker-orange bg-cream-paper",
      dotClass: "bg-marker-orange",
      nextStatus: "finished" as ReadingStatus,
      nextLabel: "Mark Finished",
    },
    finished: {
      label: "Finished",
      icon: CheckCircle2,
      className: "border-[#22c55e] text-[#1e7e34] bg-cream-paper",
      dotClass: "bg-[#22c55e]",
      nextStatus: "want_to_read" as ReadingStatus,
      nextLabel: "Reread",
    },
  };

  const currentStatus = statusConfig[book.status];
  const StatusIcon = currentStatus.icon;

  const handleNextStatus = async () => {
    if (updating) return;
    setUpdating(true);
    await onUpdateStatus(book.id, currentStatus.nextStatus);
    setUpdating(false);
  };

  const handleStatusChange = async (st: ReadingStatus) => {
    if (updating) return;
    setUpdating(true);
    await onUpdateStatus(book.id, st);
    setUpdating(false);
    setShowMenu(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleting) return;
    setDeleting(true);
    await onDeleteBook(book.id);
    setDeleting(false);
    setShowMenu(false);
  };

  return (
    <article className="shelfly-card relative flex flex-col justify-between overflow-hidden bg-cream-paper p-5 group">
      <div>
        {/* Book Cover */}
        <div className="relative aspect-[3/4] w-full rounded-[8px] overflow-hidden bg-dew-drop border border-charcoal/10 shadow-xs mb-4">
          {book.coverImage && !imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            /* Editorial Typographic Book Jacket Fallback */
            <div className="w-full h-full flex flex-col justify-between p-4 bg-linear-to-b from-[#f7efe9] to-[#efe5dd] text-cocoa-ink border-l-4 border-charcoal/30">
              <div className="w-6 h-6 rounded-full border border-charcoal/20 flex items-center justify-center opacity-60">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div className="my-auto">
                <p className="font-serif-literary text-lg font-bold leading-tight tracking-tight line-clamp-3">
                  {book.title}
                </p>
                <p className="text-xs text-charcoal/75 mt-1 font-sans line-clamp-2">
                  {book.author}
                </p>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-charcoal/40 font-mono">
                shelfly edition
              </div>
            </div>
          )}

          {/* Quick Status Pill Overlay */}
          <div className="absolute top-2.5 left-2.5">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-xs shadow-2xs",
                currentStatus.className
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", currentStatus.dotClass)} />
              {currentStatus.label}
            </span>
          </div>

          {/* Menu Dropdown Button (•••) */}
          <div className="absolute top-2.5 right-2.5">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="w-7 h-7 rounded-full bg-cream-paper/90 border border-charcoal/20 flex items-center justify-center text-charcoal hover:bg-cream-paper shadow-2xs transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 mt-1 w-44 rounded-[12px] bg-cream-paper border border-charcoal/20 shadow-lg py-1.5 z-20"
                onMouseLeave={() => {
                  setShowMenu(false);
                  setConfirmDelete(false);
                }}
              >
                <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-charcoal/40 border-b border-charcoal/10">
                  change status
                </div>
                {(["want_to_read", "reading", "finished"] as ReadingStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    disabled={updating}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-dew-drop transition-colors",
                      book.status === st ? "font-semibold text-cocoa-ink" : "text-charcoal/80",
                      updating && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span>{statusConfig[st].label}</span>
                    {book.status === st && <Check className="w-3.5 h-3.5 text-marker-orange" />}
                  </button>
                ))}

                <div className="my-1 border-t border-charcoal/10" />

                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="w-full text-left px-3 py-1.5 text-xs text-burnt-sienna hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete book</span>
                  </button>
                ) : (
                  <div className="p-2 bg-red-50/70 rounded-b-[10px]">
                    <p className="text-[11px] text-red-800 font-medium mb-1.5">Confirm delete?</p>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleDeleteConfirm}
                        disabled={deleting}
                        className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleting ? "deleting..." : "Yes, delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="px-2 py-0.5 rounded-md bg-white border border-gray-300 text-charcoal text-[11px] hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Title and Author */}
        <h3 className="font-serif-literary text-xl font-bold text-cocoa-ink leading-tight line-clamp-2">
          {book.title}
        </h3>
        <p className="font-sans text-sm text-charcoal/70 mt-1 line-clamp-1">
          {book.author}
        </p>
      </div>

      {/* Status Advance Action Button */}
      <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleNextStatus}
          className="flex-1 py-1.5 px-3 rounded-[20px] text-xs font-medium border border-charcoal/20 bg-dew-drop/60 hover:bg-dew-drop hover:border-charcoal/40 text-charcoal flex items-center justify-center gap-1.5 transition-colors"
        >
          <StatusIcon className="w-3 h-3 text-charcoal/60" />
          <span>{currentStatus.nextLabel}</span>
          <ArrowRight className="w-3 h-3 text-charcoal/40" />
        </button>
      </div>
    </article>
  );
}

export default BookCard;
