# Shelfly — Implementation Plan

Built in four phases, each ending in a review gate, followed by a final QA
pass across functionality, animation, responsiveness, backend, and polish —
matching the intended build pipeline (PRD → TRD → design.md → this plan →
coding agent → phased build → review → ship).

Phases 1-3 build the frontend against `localStorage`, exactly as planned
originally. Phase 4 swaps that for Supabase without touching component code,
per the `storage.ts` abstraction defined in TRD §4. Do the frontend phases
first and get them fully working — don't start Phase 4 until Phase 3 passes
its review gate.

---

## Phase 1 — Functionality (no visual polish yet)
Goal: every PRD workflow works end-to-end with plain, unstyled markup.

- [ ] Set up project scaffold (React + TypeScript, Tailwind config wired to
      `design.md` tokens, but not yet applied to components)
- [ ] Implement `Book` type and `storage.ts` (load/save to `localStorage`)
- [ ] Build `Dashboard` shell holding book-collection state
- [ ] Build `AddBookModal` with required-field validation (title, author)
- [ ] Build `BookGrid` + bare-bones `BookCard` (text only, status shown as
      plain text, delete via a plain button — no design system yet)
- [ ] Wire status update (Want to Read → Reading → Finished, plus manual
      override to any status)
- [ ] Wire delete
- [ ] Wire `FilterTabs` (All / Want to Read / Reading / Finished)
- [ ] Wire `SearchBar` (title/author substring match), composing with filter
- [ ] Wire `StatsBar` counts, recomputed from live state
- [ ] Implement both empty-state variants (no books / no matches)

**Review Gate 1 — Functionality**
Confirm against PRD §5-6 and TRD §6-7: add, update status, delete, filter,
search, and empty states all work with zero page reloads and correct
validation, using a real `localStorage`-backed collection. No design tokens
applied yet — this gate is about correctness, not looks.

---

## Phase 2 — Visual System (apply design.md)
Goal: the app looks like Shelfly, not a wireframe.

- [ ] Apply color tokens (Cream Paper canvas, Dew Drop secondary surfaces,
      Charcoal borders/text, Cocoa Ink headlines)
- [ ] Apply type scale: gelica for display/heading/body, Geist for
      caption/body-sm, per the corrected Type Scale table
- [ ] Style `BookCard` per the Book Cover Card component spec (cover image,
      12px radius, `--shadow-lg`, title/author typography)
- [ ] Style `Status Badge` per the three-status mapping in design.md
      (Want to Read / Reading / Finished — icon or label, never color alone)
- [ ] Style `Pill Action Button` for Add Book / modal actions (cream fill,
      Charcoal border, no filled CTA)
- [ ] Style `AddBookModal` (12px radius panel, dimmed scrim, 16px field
      gaps, inline validation styling)
- [ ] Style `FilterTabs`, `SearchBar`, `StatsBar` per the toolbar layout
- [ ] Add sticker illustrations and Handwritten Caption to empty states only
      (per Do's/Don'ts — decoration stays off functional controls)
- [ ] Add the Footer Brand Band

**Review Gate 2 — Visual System**
Confirm against design.md's Do's/Don'ts directly: no filled CTAs, no
glassmorphism/gradients, no Sky/Bubblegum/Sprout on functional UI, headlines
lowercase in Cocoa Ink, correct radii per element. Check the corrected hex
values (`#ff6f1e`) actually made it into the Tailwind theme.

---

## Phase 3 — Interaction, Animation & Responsiveness
Goal: the app feels alive and works on every screen size.

- [ ] Card hover: subtle lift (1-2px translateY), no shadow-weight increase
      beyond `--shadow-lg`
- [ ] Status-change transition: badge updates with a brief, purposeful
      transition (color/label swap), not a bouncy or decorative animation
- [ ] Modal open/close: simple fade+scale, respecting reduced-motion
      preferences
- [ ] Search/filter results: list re-renders smoothly, no layout jump
- [ ] Responsive grid: multi-column → single column reflow at defined
      breakpoints; toolbar (search/filters/add button) stacks sensibly on
      narrow viewports
- [ ] Keyboard/focus: modal focus trap, tab order through filters and cards,
      visible focus states using Charcoal outlines (not Sprout Sticker green,
      per the corrected Do's/Don'ts)

**Review Gate 3 — Interaction & Responsiveness**
Test at common breakpoints (mobile, tablet, desktop). Confirm animations are
purposeful and subtle (per design.md's "whisper-light" elevation and Do's
list), not decorative for their own sake. Confirm keyboard-only navigation
can complete the full add → update → filter → delete flow.

---

## Phase 4 — Backend & Database (Supabase)
Goal: swap `localStorage` for Supabase persistence without changing any
component or UI code, per TRD §1/§4. This phase touches only `storage.ts`
and (if needed) a new `lib/supabase.ts` client — nothing in `Dashboard`,
`BookCard`, `AddBookModal`, etc. should need to change beyond calling async
functions instead of sync ones.

### Required permissions — the agent must ask, never assume or invent
Before writing any Supabase code, the agent must stop and ask the user for
the following. Do not guess a project URL, key, schema, or security model —
wrong guesses here create real security and data-loss risk, not just a
visual mismatch like earlier phases.

- [ ] **Supabase project.** Does one already exist, or does the agent need
      to walk the user through creating one? If it exists: request the
      **Project URL** and **anon public key** (from Project Settings → API).
      Never ask for or accept the **service role key** in chat/plaintext
      unless the user explicitly wants the agent running migrations
      directly — flag that this key bypasses Row Level Security and must
      never be committed to the repo or exposed client-side.
- [ ] **Where secrets live.** Confirm the user wants `NEXT_PUBLIC_SUPABASE_URL`
      / `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`, and confirm
      `.env.local` is already in `.gitignore` before writing it — check,
      don't assume.
- [ ] **Schema confirmation.** Propose the `books` table SQL below and get
      explicit confirmation before running it (or ask the user to run it
      themselves in the Supabase SQL Editor if no DB connection was shared):

  ```sql
  create table books (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    author text not null,
    cover_image text,
    status text not null check (status in ('want_to_read', 'reading', 'finished')),
    created_at timestamptz not null default now()
  );
  ```

- [ ] **Auth & Row Level Security.** TRD §1 assumes single-user for now.
      Ask explicitly: leave RLS off for a single-user MVP (simplest, but
      the table is open to anyone with the anon key), or enable RLS with a
      real auth flow now. Do not silently pick one — this is a security
      decision the user should make knowingly.
- [ ] **Existing local data.** If the user already has books saved in
      `localStorage` from Phases 1-3 testing, ask whether they want a
      one-time import into Supabase, or a clean start.

### Implementation tasks (only after the above is answered)
- [ ] Install `@supabase/supabase-js`
- [ ] Create `lib/supabase.ts` — a single exported client instance
- [ ] Rewrite `storage.ts`'s internals to call Supabase (`select`/`insert`/
      `update`/`delete` on `books`), keeping the same exported function
      names/shapes where possible — convert to `async`/`await` and add
      loading + error states where they now cross a network boundary
- [ ] Update `Dashboard` to handle the async load (loading skeleton or
      spinner, using design.md tokens — not a generic default spinner)
      and surface fetch/write errors inline, consistent with the existing
      inline-validation pattern in TRD §7
- [ ] If RLS was enabled: implement the corresponding auth flow (scope
      determined by the user's answer above — this may be its own sub-task
      if it involves real user accounts, which is outside the original PRD
      and should be confirmed as in-scope before starting)
- [ ] Run the optional local-data import if requested

**Review Gate 4 — Backend & Database**
- [ ] CRUD against Supabase reproduces every Phase 1 behavior exactly
      (add, status change, delete, filter, search, empty states)
- [ ] `.env.local` holding real keys is not committed; `.env.example` with
      placeholder names exists instead
- [ ] No component/UI file changed beyond what calling async storage
      functions required — confirms the TRD's abstraction held
- [ ] RLS/auth state matches what the user explicitly chose above, not a
      default the agent picked on its own

---

## Final QA Checklist (pre-ship)
Run through all five in order; each should be clean before moving to the next.

1. **Functionality** — every PRD flow (§6) works with real data, survives a
   refresh, and validation blocks bad input.
2. **Animation** — hover, status change, and modal transitions are subtle
   and purposeful; nothing borrowed from the flagged "Vengeance" components
   (no glass blur, no morphing icons, no 3D/WebGL backgrounds, no unrelated
   social-dock or ASCII-footer patterns — design.md's Do's/Don'ts and its
   "keep the interface minimal" principle rule all of that out).
3. **Responsive** — dashboard, grid, and modal all work from narrow mobile
   widths up through desktop, with no horizontal scroll and no clipped
   content.
4. **Backend** — Supabase persistence matches the old localStorage behavior
   exactly; no secrets committed; RLS/auth state matches what was explicitly
   decided in Phase 4, not a default.
5. **Polish** — visual details match `design.md` exactly: correct hex values,
   correct radii per element, status badges legible without color alone,
   empty states read warmly and point clearly to the next action.

**Shelfly ✓** — ship once all five pass review.