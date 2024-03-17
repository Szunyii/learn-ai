import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ez jó megoldás nagyon a body typesaftijének kialakítására
    const parseResult = createNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.log("api", parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);
    //ez egyszerre több db operációt tud kezelni
    //így ha az egyik művelet errort dob akkor nem lesz kezelve egyik sem így nem csinál faszságokat a db-ben és fordítva egymásra hatnak
    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: { title, content, userId },
      });

      await notesIndex.upsert([
        { id: note.id, values: embedding, metadata: { userId } },
      ]);

      return note;
    });
    //
    return Response.json({ note }, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    //ez jó megoldás nagyon a body typesaftijének kialakítására
    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.log("api", parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    //itt csinálunk egy új embeddinget és a frrisítés maga az hogy kicseréljük az újat a rgévibbel
    const embedding = await getEmbeddingForNote(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: { title, content },
      });

      await notesIndex.upsert([
        { id, values: embedding, metadata: { userId } },
      ]);

      return updatedNote;
    });

    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {}
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    //ez jó megoldás nagyon a body typesaftijének kialakítására
    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.log("api", parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await prisma.note.delete({
        where: { id },
      });

      await notesIndex.deleteOne(id);
    });

    return Response.json({ message: "Note Deleted" }, { status: 200 });
  } catch (error) {}
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
