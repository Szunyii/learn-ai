import OpenAi from "openai";
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw Error("api key bad");
}

const openapi = new OpenAi({ apiKey });

export default openapi;

export async function getEmbedding(text: string) {
  const response = await openapi.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  const embedding = response.data[0].embedding;

  if (!embedding) {
    throw Error("generate error");
  }
  console.log(embedding);
  return embedding;
}
