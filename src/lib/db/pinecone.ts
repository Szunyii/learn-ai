import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw Error("pinecone err");
}

const pinecone = new Pinecone({ apiKey, environment: "gcp-starter" });
export const notesIndex = pinecone.Index("next-ai");
