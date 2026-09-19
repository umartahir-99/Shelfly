# Shelfly — Technical Requirements Document (TRD)

## 1. Assumptions
The PRD does not specify a backend, auth, or hosting model. This TRD assumes:
- Frontend-first build: a single-user, client-side Next.js app for now.
  Backend integration (Supabase, for auth + persistence) is planned as a
  follow-up phase, not part of this build — see §2 and §4.
- Persistence via `localStorage` for v1, wrapped behind a small storage
  interface so it can be swapped for Supabase later without touching UI code.
- Cover images are provided as an image URL for v1 (no file upload/storage
  pipeline yet — flagged as an open question in the PRD; Supabase Storage is
  the likely home for this once the backend phase starts).

If any of these are wrong, they should be corrected here before implementation
starts, since they shape the component and data layer below.

## 2. Tech Stack
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS v4, using the custom tokens defined in `design.md`
  (`@theme` block — colors, spacing, radius, type scale)
- **State:** Local component state + a small context/reducer for the book
  collection (no need for Redux/Zustand at this scale)
- **Persistence (now):** `localStorage`, accessed only through a `storage.ts`
  abstraction (see §4)
- **Persistence (planned):** Supabase (Postgres + Auth + Storage) — not part
  of this build. The `storage.ts` abstraction exists specifically so this
  swap doesn't touch any UI or component code when it happens.

## 3. Data Model

```ts
export type ReadingStatus = 'want_to_read' | 'reading' | 'finished';

export interface Book {
  id: string;            // uuid, generated on create
  title: string;
  author: string;
  coverImage?: string;   // image URL; falls back to a placeholder in the UI
  status: ReadingStatus;
  createdAt: string;     // ISO timestamp, used for stable sort order
}
```

## 4. Persistence Layer

```ts
// storage.ts — the ONLY module that touches localStorage directly
const KEY = 'shelfly:books';

export function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return []; // corrupt/missing data should never crash the dashboard
  }
}

export function saveBooks(books: Book[]): void {
  localStorage.setItem(KEY, JSON.stringify(books));
}
```

Every read/write goes through `loadBooks` / `saveBooks` so the storage backend
can be swapped for Supabase later (a `books` table, `select`/`insert`/
`update`/`delete` calls via the Supabase client) by editing this one file —
no component or UI code should need to change when that happens.

## 5. Component Architecture

```
<App>
  <Dashboard>
    <Header />               // logo, top-right nav if any
    <WelcomeHeading />
    <StatsBar />              // total / want_to_read / reading / finished counts
    <Toolbar>
      <SearchBar />
      <FilterTabs />
      <AddBookButton />
    </Toolbar>
    <BookGrid>
      <BookCard />  × N
      <EmptyState />          // shown instead of BookGrid contents when list is empty
    </BookGrid>
  </Dashboard>
  <AddBookModal />             // mounted at App level, opened via context/state
</App>
```

### Component responsibilities
| Component | Responsibility |
|---|---|
| `Dashboard` | Owns the book collection state, derives filtered/searched view |
| `StatsBar` | Pure display — receives counts, no logic |
| `SearchBar` | Controlled input, debounced only if needed (not required at this scale) |
| `FilterTabs` | Controlled tab state, one active status filter (or "All") |
| `BookGrid` | Renders `BookCard`s for the current filtered+searched list, or `EmptyState` |
| `BookCard` | Displays one book; exposes status-change and delete actions upward |
| `AddBookModal` | Controlled form with validation; calls back to add a book on submit |
| `EmptyState` | Two variants: "no books at all" vs "no matches for filter/search" |

## 6. Filtering & Search Logic
Both operate on the in-memory book list; no need to hit storage per keystroke.

```ts
function getVisibleBooks(
  books: Book[],
  status: ReadingStatus | 'all',
  query: string
): Book[] {
  const byStatus = status === 'all'
    ? books
    : books.filter(b => b.status === status);

  if (!query.trim()) return byStatus;

  const q = query.trim().toLowerCase();
  return byStatus.filter(
    b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
  );
}
```

Filter and search compose (filter narrows first, search narrows further), per
PRD §5.5.

## 7. Validation Rules
- `title`: required, non-empty after trim
- `author`: required, non-empty after trim
- `coverImage`: optional; if provided, should be a syntactically valid URL —
  invalid URLs fall back to the placeholder cover rather than blocking submit
- `status`: required, defaults to `want_to_read` if not chosen

Validation errors surface inline, next to the offending field, per PRD §5.2 —
not as a toast or alert.

## 8. Accessibility
- `AddBookModal` traps focus while open and returns focus to the triggering
  button on close
- Status badges carry a text label, not color alone (per PRD §5.4)
- Filter tabs and the status-update control are keyboard operable (`Tab` /
  `Enter` / `Space`)
- Delete is a two-step action (menu → confirm) to avoid accidental data loss,
  since there is no undo in v1

## 9. Performance
At the scale implied by the PRD (a personal shelf, not a library catalog —
realistically dozens to a few hundred books), no virtualization or pagination
is needed. Re-filtering the full list on every keystroke is cheap enough to
run synchronously.

## 10. Non-Functional Requirements
- Light theme only (per `design.md`); no dark-mode requirement in the PRD
- Responsive grid: cards reflow from a multi-column grid down to a single
  column on narrow viewports
- No page reloads for any CRUD action (PRD §8)

## 11. Testing Strategy
- **Unit:** `getVisibleBooks` filter/search logic, storage load/save
  (with a mocked `localStorage`)
- **Component:** `BookCard` status-change and delete callbacks fire correctly;
  `AddBookModal` blocks submit on missing required fields
- **Integration:** add → appears in grid → filter/search finds it → status
  change updates its badge and the stats bar → delete removes it