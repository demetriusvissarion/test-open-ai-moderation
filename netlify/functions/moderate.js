// [POST] /.netlify/functions/moderate
import OpenAI from "openai";

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type",
  "access-control-allow-methods": "POST, OPTIONS",
  "content-type": "application/json",
};

export default async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "Use POST" }), {
      status: 405,
      headers: cors,
    });

  const { imageUrl, caption } = await req.json();
  if (!imageUrl && !caption) {
    return new Response(
      JSON.stringify({ error: "Provide imageUrl and/or caption" }),
      { status: 400, headers: cors }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const input = [];
  if (imageUrl) input.push({ type: "image_url", image_url: { url: imageUrl } });
  if (caption) input.push({ type: "text", text: caption });

  try {
    const resp = await openai.moderations.create({
      model: "omni-moderation-latest",
      input,
    });
    return new Response(JSON.stringify(resp), { status: 200, headers: cors });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message || "Moderation failed" }),
      { status: 500, headers: cors }
    );
  }
};
