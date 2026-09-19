import { Book } from './types';
import { supabase } from './supabase';

async function getCurrentUserId(): Promise<string | null> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
    status: 'reading',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'book-2',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=800&auto=format&fit=crop',
    status: 'reading',
    createdAt: '2026-01-12T14:30:00.000Z',
  },
  {
    id: 'book-3',
    title: 'Before the Coffee Gets Cold',
    author: 'Toshikazu Kawaguchi',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
    status: 'want_to_read',
    createdAt: '2026-01-15T09:15:00.000Z',
  },
  {
    id: 'book-4',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop',
    status: 'finished',
    createdAt: '2026-01-05T18:20:00.000Z',
  },
  {
    id: 'book-5',
    title: 'A Gentleman in Moscow',
    author: 'Amor Towles',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
    status: 'want_to_read',
    createdAt: '2026-01-18T11:00:00.000Z',
  },
];

/** Fetch all books for the current user from Supabase */
export async function fetchBooks(): Promise<{ data: Book[] | null; error: string | null }> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { data: [], error: 'Please sign in to load your shelf.' };
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205' || /could not find the table ['"]?public\.books/i.test(error.message)) {
        return {
          data: null,
          error: 'Your database is not initialized yet. Run src/backend/sql/001_books.sql in the Supabase SQL Editor, then try again.',
        };
      }
      return { data: null, error: error.message };
    }

    const books: Book[] = (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      author: row.author,
      coverImage: row.cover_image || undefined,
      status: row.status,
      createdAt: row.created_at,
    }));

    return { data: books, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch books' };
  }
}

/** Add a new book to Supabase */
export async function addBook(bookData: {
  title: string;
  author: string;
  coverImage?: string;
  status: Book['status'];
}): Promise<{ data: Book | null; error: string | null }> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { data: null, error: 'Please sign in to add a book.' };
    }

    const { data, error } = await supabase
      .from('books')
      .insert({
        user_id: userId,
        title: bookData.title,
        author: bookData.author,
        cover_image: bookData.coverImage || null,
        status: bookData.status,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    const book: Book = {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      author: data.author,
      coverImage: data.cover_image || undefined,
      status: data.status,
      createdAt: data.created_at,
    };

    return { data: book, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to add book' };
  }
}

/** Update a book's status in Supabase */
export async function updateBookStatus(
  id: string,
  status: Book['status']
): Promise<{ error: string | null }> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { error: 'Please sign in to update your shelf.' };
    }

    const { error } = await supabase
      .from('books')
      .update({ status })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update book' };
  }
}

/** Delete a book from Supabase */
export async function deleteBook(id: string): Promise<{ error: string | null }> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { error: 'Please sign in to delete a book.' };
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to delete book' };
  }
}

/** Pure function: filter + search (no DB calls, unchanged) */
export function getVisibleBooks(
  books: Book[],
  status: 'all' | Book['status'],
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
