import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { FormInput } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { useRouter } from "next/navigation";
import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { Note } from "@prisma/client";
import { error } from "console";

interface AddNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}

const AddNoteDialog = ({ setOpen, open, noteToEdit }: AddNoteDialogProps) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  //type safe form schema létrehozása ami kell is a shadcn formjához
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  async function onSubmit(input: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch("api/notes", {
          method: "PUT",
          body: JSON.stringify({ id: noteToEdit.id, ...input }),
        });
        if (!response.ok) {
          console.log("error");
        }
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          throw Error("Status code ");
        }
      }

      form.reset();
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.log("onf");
    }
  }

  async function deleteNote() {
    if (!noteToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({ id: noteToEdit.id }),
      });

      if (!response.ok) {
        console.log("err");
      }
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.log("onf del");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>{noteToEdit ? "edit note" : "Add Note"}</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete Note
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
