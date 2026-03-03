import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export const metadata = {
  title: 'Notes | NoteHub',
  description: 'View and manage your notes',
};

export default async function NotesPage() {
  const queryClient = getQueryClient();
  const tag = '';

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes(1, '', tag),
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </main>
  );
}
