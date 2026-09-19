export type ReadingStatus = 'want_to_read' | 'reading' | 'finished';

export interface Book {
  id: string;
  userId?: string;
  title: string;
  author: string;
  coverImage?: string;
  status: ReadingStatus;
  createdAt: string;
}

export type FilterStatus = 'all' | ReadingStatus;

export interface StatCounts {
  total: number;
  want_to_read: number;
  reading: number;
  finished: number;
}
