
"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import css from "./notes.module.css";
import { useMutation } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/Pagination/Pagination";
import { useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const selectedTag = !tag || tag === "all" ? undefined : tag;

  const { data } = useQuery({
    queryKey: ["notes", page, query, selectedTag],
    queryFn: () => fetchNotes(page, query, selectedTag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const notes = data?.notes || [];
  console.log(data);
  console.log(selectedTag);
  const totalPages = data?.totalPages || 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const debouncedSetQuery = useDebouncedCallback(handleSearch, 500);

  const queryClient = useQueryClient();

  useMutation({
        mutationFn: deleteNote,
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
        onError(error) {
            console.log(error);
        },
    });

  return (
    <div className={css.notesContainer}>
      <div className={css.toolbar}>
        <SearchBox onSearch={debouncedSetQuery} />
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.createButton} onClick={handleOpenModal}>
          Create note +
        </button>
      </div>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
      {notes.length > 0 && <NoteList notes={notes} />}
      {notes.length === 0 && <p>No notes found.</p>}
    </div>
  );
}
