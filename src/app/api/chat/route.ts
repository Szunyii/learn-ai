import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openapi, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n")
    );
    //example
    //hey whats my wifi password
    //your wifi password is fs
    //thafa

    const { userId } = auth();
    // ez a relevant notos megoldás nagyon jó
    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 1,
      filter: { userId },
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: { in: vectorQueryResponse.matches.map((match) => match.id) },
      },
    });

    console.log("relevant notes", relevantNotes);

    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content:
        "You are an intelligent note-taking app. You answer the user's question based on their notes." +
        "The relevant notes for this query are: \n" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n ${note.content}`)
          .join("\n\n"),
    };
    //this all is the request
    const response = await openapi.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });
    //ez csatlakozik a usechathez
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "something wrond" }, { status: 500 });
  }
}
