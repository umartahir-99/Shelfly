"use client";

import React from "react";
import { Sparkles, Bookmark, Heart, BookOpen, Star, Feather } from "lucide-react";
import { Highlighter } from "@/components/ui/highlighter";
import Book from "./Book";

export function WelcomeBanner() {
  return (
    <section className="relative w-full max-w-[1200px] mx-auto px-6 pt-6 pb-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
        <div className="flex-1 max-w-[620px] text-left">
          {/* Rotated sticker badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="sticker-tag bg-[#f7efe9] text-[#171717] border-charcoal/20 -rotate-3 hover:rotate-0 transition-transform duration-200">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6f1e]" />
              reading sanctuary
            </span>
            <span className="sticker-tag bg-[#f7efe9] text-[#171717] border-charcoal/20 rotate-4 hover:rotate-0 transition-transform duration-200">
              <Bookmark className="w-3.5 h-3.5 text-[#3b82f6]" />
              mindful tracking
            </span>
            <span className="sticker-tag bg-[#f7efe9] text-[#171717] border-charcoal/20 -rotate-2 hover:rotate-0 transition-transform duration-200">
              <Heart className="w-3.5 h-3.5 text-[#ff66cf]" />
              one book at a time
            </span>
          </div>

          <h1 className="font-serif-literary text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] text-cocoa-ink tracking-tight uppercase">
            your personal reading{" "}
            <Highlighter action="highlight" color="#FFB86B">
              shelf
            </Highlighter>
            .
          </h1>

          <p className="mt-4 text-base md:text-lg text-charcoal/80 leading-relaxed font-sans max-w-[54ch]">
            capture what you want to explore, cherish the pages you are turning, and look back fondly on the stories you finished.
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm handwritten-caption">
            <span>↳ log in under 30 seconds &bull; zero noise &bull; pure reading joy</span>
          </div>
        </div>

        {/* 3D Book Cover Art — stacked shelf display */}
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] shrink-0 flex flex-col items-center justify-center gap-3 py-4">
          <div className="flex items-end gap-2 sm:gap-3">
            <Book
              title="shelfly."
              variant="stripe"
              color="#ff6f1e"
              textColor="#2b1a07"
              width={140}
              logo={<BookOpen className="w-4 h-4 text-[#2b1a07]/60" />}
            />
            <Book
              title="track."
              variant="simple"
              color="#22c55e"
              textColor="#fdfbf9"
              width={140}
              logo={<Star className="w-4 h-4 text-[#fdfbf9]/70" />}
            />
            <Book
              title="finish."
              variant="stripe"
              color="#3b82f6"
              textColor="#2b1a07"
              width={140}
              logo={<Feather className="w-4 h-4 text-[#2b1a07]/60" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WelcomeBanner;
