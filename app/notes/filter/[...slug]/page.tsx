import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";

interface NoteListProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

export default async function Notelist({
  params,
  searchParams,
}: NoteListProps) {
  const { slug } = await params;
  const { page, query } = await searchParams;

  const tag = slug?.[0];
  const currentPage = Number(page ?? 1);
  const searchQuery = query ?? "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentPage, searchQuery, tag],
    queryFn: () =>
      fetchNotes(
        currentPage,
        searchQuery,
        !tag || tag === "all" ? undefined : tag,
      ),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient
        tag={tag}
        />
      </HydrationBoundary>
    </>
  );
}