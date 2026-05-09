import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const chat = catchAsync(async (req, res, next) => {
  const { message, history, systemPrompt } = req.body;

  if (!message) return next(new AppError("Message is required", 400));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      ...(history || []),
      { role: "user", parts: [{ text: message }] },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300,
      topP: 0.95,
      topK: 40,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    return next(new AppError(JSON.stringify(error), response.status));
  }

  const data = await response.json();
  const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  res.status(200).json({
    status: "success",
    data: { text: aiText || "عذراً، لم أتمكن من الرد." },
  });
});