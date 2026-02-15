import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const input = process.argv.slice(2).join(" ");

if (!input) {
  console.log("Usage: chat \"your prompt\"");
  process.exit(1);
}

const completion = await client.responses.create({
  model: "gpt-4.1-mini",
  input: input,
});

console.log(completion.output_text);
