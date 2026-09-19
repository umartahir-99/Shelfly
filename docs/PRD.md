# Shelfly — Product Requirements Document (PRD)

## 1. Overview
Shelfly is a personal book-tracking web app. Users log the books they own or want to
read, and move each one through a simple reading journey:

**Want to Read → Reading → Finished**

The product is intentionally small in scope: one user, one collection, no social
features, no backend complexity beyond storing a list of books. Visual polish and a
pleasant reading-journal feel matter more than feature breadth.

## 2. Goals
- Let a user capture a book (title, author, cover, status) in under 30 seconds.
- Make the current state of the collection (counts per status) visible at a glance.
- Make moving a book between statuses a one-click action.
- Keep the UI calm, warm, and uncluttered — a "reading shelf," not a project tracker.

## 3. Non-Goals (out of scope for v1)
- User accounts / multi-user support / authentication
- Star ratings, reviews, or written notes per book
- Page-count or percentage progress tracking within "Reading"
- Social sharing, following, or public shelves
- Import from Goodreads / ISBN lookup / barcode scanning
- Multiple shelves or custom tags beyond the three statuses

If any of these are actually wanted, they should be added to this PRD explicitly
before the TRD or implementation plan account for them.

## 4. Core Data Model
Each book record contains:

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Unique identifier, generated on create |
| `title` | string | yes | |
| `author` | string | yes | |
| `coverImage` | string (URL) | no | Falls back to a placeholder cover if empty |
| `status` | enum | yes | `want_to_read` \| `reading` \| `finished` |

## 5. Feature Requirements

### 5.1 Dashboard
- App name/logo (Shelfly) and header
- Short welcome heading / tagline ("Your personal reading shelf.")
- Stat row: total books, Want to Read count, Reading count, Finished count
- Search bar (title/author)
- Status filter tabs: All, Want to Read, Reading, Finished
- "+ Add Book" button, always reachable
- Responsive grid of book cards

### 5.2 Add Book
A modal or dedicated view with:
- Cover image (upload or image URL)
- Title (required)
- Author (required)
- Status (defaults to "Want to Read")
- Cancel / Add Book actions
- Inline validation with a clear error message on missing required fields

On submit, the new book appears in the grid immediately — no reload.

### 5.3 Book Card
Each card shows:
- Large cover image
- Title, author
- A status badge, visually distinct per status
- A control to update status
- A "more options" (•••) control exposing delete
- Subtle hover state (lift, shadow, or border shift) — nothing heavy

### 5.4 Status Management
- A book can move Want to Read → Reading → Finished, or be set to any status directly
- Status changes reflect in the UI immediately (no page reload, no stale counts)
- Badges must be legible and distinguishable without relying on color alone
  (icon or label, not color-only, for accessibility)

### 5.5 Filtering
- Filtering by All / Want to Read / Reading / Finished
- Filter and search compose together (e.g. searching "tolkien" while filtered to
  "Reading" only shows matching books that are currently being read)

### 5.6 Search
- Matches against title and author, case-insensitive, substring match
- Updates the grid live as the user types, no submit button required

### 5.7 Empty States
- No books at all: "No books on your shelf yet." / "Start building your reading
  list by adding your first book." / [+ Add Your First Book]
- A filter with no matches: "No books here yet."
- A search with no matches: needs its own short message (not specified in the
  original brief — recommend: "No books match your search.")

## 6. Primary User Flow
1. User opens the dashboard and sees their current collection and stats.
2. User clicks **Add Book**, fills the form, submits.
3. New book appears in the grid at "Want to Read" (or chosen status).
4. As the user progresses through a book, they update its status from the card.
5. Stats and filtered views update immediately.
6. User can search or filter at any point to find a specific book.
7. User can delete a book they no longer want tracked.

## 7. Success Criteria
- Adding, updating, filtering, searching, and deleting a book all work with zero
  page reloads and no perceptible lag for a collection under ~200 books.
- The dashboard's empty state is the first thing a brand-new user sees and it
  clearly explains the next action.
- Visual design follows `design.md` (cream canvas, charcoal ink, marker-orange
  accent, lowercase gelica headlines, pill buttons with dark borders).

## 8. Open Questions (resolve before build)
- Is persistence expected to survive a browser refresh (localStorage) or is a
  backend/API planned for a later version? (TRD assumes localStorage for v1.)
- Should cover image "upload" store the actual file, or is an image URL enough
  for v1? (TRD assumes URL-only for v1, upload deferred.)
