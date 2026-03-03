import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

export const metadata = {
  title: 'Note Details | NoteHub',
  description: 'View note details',
};

interface NoteDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id),
    });
  } catch (error) {
    console.error('Error prefetching note:', error);
  }

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient noteId={id} />
      </HydrationBoundary>
    </main>
  );
}
