import Note from "@/components/Note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import React from "react";

const NotesPage = async () => {
  const { userId } = auth();
  if (!userId) {
    throw Error("userid undefined");
  }
  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className="text-center col-span-full ">
          You don&apos;t have any notes yet. Why don&apos;t you cretate one
        </div>
      )}
    </div>
  );
};

export default NotesPage;
