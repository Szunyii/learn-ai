"use client";
import { Note as NoteModel } from "@prisma/client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import AddNoteDialog from "./AddNoteDialog";

interface NoteProps {
  note: NoteModel;
}

const Note = ({ note }: NoteProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const wasUpdated = note.updatedAt > note.createdAt;

  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();
  return (
    <>
      <Card
        className="transition-shadow cursor-pointer hover:shadow-lg"
        onClick={() => setShowEdit(true)}
      >
        <CardHeader>
          {note.title}
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && "(updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{note.content}</p>
        </CardContent>
      </Card>
      <AddNoteDialog setOpen={setShowEdit} open={showEdit} noteToEdit={note} />
    </>
  );
};

export default Note;
