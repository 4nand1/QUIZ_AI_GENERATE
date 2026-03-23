import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import prisma from "@/lib/prisma";

const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
const gemini = apiKey ? new GoogleGenAI({ apiKey }) : null;
const model = "gemini-2.5-flash";

const QUESTION_COUNT = 5;
const OPTION_COUNT = 4;
const MAX_SUMMARY_SENTENCES = 8;
const MIN_SUMMARY_SENTENCES = 4;

const QUIZ_RESPONSE_SCHEMA = {
  type: "object",
  required: ["summary", "questions"],
  properties: {
    summary: { type: "string" },
    questions: {
      type: "array",
      minItems: QUESTION_COUNT,
      maxItems: QUESTION_COUNT,
      items: {
        type: "object",
        required: ["question", "options", "correctIndex"],
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            minItems: OPTION_COUNT,
            maxItems: OPTION_COUNT,
            items: { type: "string" },
          },
          correctIndex: {
            type: "integer",
            minimum: 0,
            maximum: OPTION_COUNT - 1,
          },
        },
      },
    },
  },
} as const;

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

type QuizPayload = {
  summary: string;
  questions: QuizQuestion[];
};

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const data = await request.json().catch(() => null);
    const title = typeof data?.title === "string" ? data.title.trim() : "";
    const content = typeof data?.content === "string" ? data.content.trim() : "";

    if (!title || !content) {
      return new Response("Please provide both title and content", {
        status: 400,
      });
    }

    const response = await generateQuiz(content);

    if (!response) {
      return new Response("Failed to generate quiz", { status: 500 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        userId,
        title,
        content,
        summary: response.summary,
        questions: {
          create: response.questions.map((question) => ({
            question: question.question,
            answers: question.options,
            correct: question.options[question.correctIndex],
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return Response.json(quiz);
  } catch (error) {
    console.error("Failed to create quiz", error);
    return new Response("Failed to create quiz", { status: 500 });
  }
}

const prompt = `
You create study materials from the provided content.

Return ONLY valid JSON (no markdown, no extra text) that matches this TypeScript shape:
{
  "summary": string,
  "questions": [
    {
      "question": string,
      "options": [string, string, string, string],
      "correctIndex": 0|1|2|3
    }
  ]
}

Rules:
- summary: 4-8 sentences, clear and faithful to the content.
- quiz: exactly 5 questions.
- Each question must be answerable using ONLY the given content.
- Options must be plausible; exactly one correct option per question.
- Do not include explanations.
- Avoid trick questions.
`
async function generateQuiz(content: string): Promise<QuizPayload | null> {
  if (gemini) {
    try {
      const generatedWithAi = await generateWithGemini(content);

      if (generatedWithAi) {
        return generatedWithAi;
      }
    } catch (error) {
      console.error("Gemini generation failed, using local fallback", error);
    }
  }

  return generateLocally(content);
}

async function generateWithGemini(content: string): Promise<QuizPayload | null> {
  if (!gemini) {
    return null;
  }

  const response = await gemini.models.generateContent({
    model,
    contents: content,
    config: {
      systemInstruction: prompt,
      responseMimeType: "application/json",
      responseJsonSchema: QUIZ_RESPONSE_SCHEMA,
    },
  });

  const rawText = extractResponseText(response);

  if (!rawText) {
    return null;
  }

  return normalizeQuizPayload(JSON.parse(rawText));
}

function extractResponseText(
  response: Awaited<ReturnType<GoogleGenAI["models"]["generateContent"]>>,
): string | null {
  if (typeof response.text === "string" && response.text.trim()) {
    return response.text.trim();
  }

  const parts = response.candidates?.[0]?.content?.parts;

  if (!parts?.length) {
    return null;
  }

  const textParts = parts
    .map((part) => ("text" in part && typeof part.text === "string" ? part.text : ""))
    .filter(Boolean);

  return textParts.length ? textParts.join("").trim() : null;
}

function normalizeQuizPayload(value: unknown): QuizPayload | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const payload = value as Record<string, unknown>;
  const summary =
    typeof payload.summary === "string"
      ? normalizeWhitespace(payload.summary)
      : "";
  const questions = Array.isArray(payload.questions) ? payload.questions : [];

  if (!summary) {
    return null;
  }

  const normalizedQuestions = questions
    .map((question) => normalizeQuestion(question))
    .filter((question): question is QuizQuestion => question !== null)
    .slice(0, QUESTION_COUNT);

  if (normalizedQuestions.length !== QUESTION_COUNT) {
    return null;
  }

  return {
    summary,
    questions: normalizedQuestions,
  };
}

function normalizeQuestion(value: unknown): QuizQuestion | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const questionPayload = value as Record<string, unknown>;
  const question =
    typeof questionPayload.question === "string"
      ? normalizeWhitespace(questionPayload.question)
      : "";
  const rawOptions = Array.isArray(questionPayload.options)
    ? questionPayload.options
    : [];
  const correctIndex =
    typeof questionPayload.correctIndex === "number"
      ? questionPayload.correctIndex
      : -1;
  const options = rawOptions
    .map((option: unknown) =>
      typeof option === "string" ? normalizeWhitespace(option) : "",
    )
    .filter(Boolean)
    .slice(0, OPTION_COUNT);

  if (!question || options.length !== OPTION_COUNT) {
    return null;
  }

  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
    return null;
  }

  const uniqueOptions = new Set(options.map((option) => option.toLowerCase()));

  if (uniqueOptions.size !== OPTION_COUNT) {
    return null;
  }

  return {
    question,
    options,
    correctIndex,
  };
}

function generateLocally(content: string): QuizPayload {
  const normalizedContent = normalizeWhitespace(content);
  const sentences = splitIntoSentences(normalizedContent);
  const fragments = buildFragments(normalizedContent);
  const summary = buildSummary(sentences, fragments);
  const questions = buildQuestions(fragments, normalizedContent);

  return { summary, questions };
}

function splitIntoSentences(content: string): string[] {
  return content
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => normalizeWhitespace(sentence))
    .filter((sentence) => sentence.length > 20);
}

function buildFragments(content: string): string[] {
  const sentenceFragments = splitIntoSentences(content);
  const clauseFragments = content
    .split(/[;:\n]/)
    .map((fragment) => normalizeWhitespace(fragment))
    .filter((fragment) => fragment.length > 20);

  return Array.from(new Set([...sentenceFragments, ...clauseFragments]));
}

function buildSummary(sentences: string[], fragments: string[]): string {
  const sourceParts = (sentences.length ? sentences : fragments).slice(
    0,
    MAX_SUMMARY_SENTENCES,
  );
  const keywords = extractKeywords(sentences.join(" ") || fragments.join(" "));
  const fallbackParts = [
    "The content introduces a focused set of ideas and details.",
    keywords[0]
      ? `A key topic throughout the text is ${keywords[0]}.`
      : "It presents several important facts drawn from the provided material.",
    keywords[1]
      ? `It also gives attention to ${keywords[1]}.`
      : "Several details reinforce the main point of the text.",
    "The main points are presented as connected facts from the provided material.",
  ].filter(Boolean);

  const targetLength = Math.max(
    MIN_SUMMARY_SENTENCES,
    Math.min(MAX_SUMMARY_SENTENCES, sourceParts.length || fallbackParts.length),
  );

  return [...sourceParts, ...fallbackParts]
    .slice(0, targetLength)
    .map(ensureSentenceEnding)
    .join(" ");
}

function buildQuestions(fragments: string[], content: string): QuizQuestion[] {
  const keywords = extractKeywords(content);
  const candidates = fragments.flatMap((fragment) => {
    const fragmentKeywords = extractKeywords(fragment).slice(0, 3);

    return fragmentKeywords.map((keyword) => ({ fragment, keyword }));
  });

  const dedupedCandidates = Array.from(
    new Map(
      candidates.map((candidate) => [
        `${candidate.fragment.toLowerCase()}::${candidate.keyword.toLowerCase()}`,
        candidate,
      ]),
    ).values(),
  );

  const selectedCandidates = Array.from({ length: QUESTION_COUNT }, (_, index) => {
    return dedupedCandidates[index] ?? {
      fragment: fragments[index % Math.max(fragments.length, 1)] ?? ensureSentenceEnding(content.slice(0, 120)),
      keyword: keywords[index % Math.max(keywords.length, 1)] ?? `detail ${index + 1}`,
    };
  });

  return selectedCandidates.map(({ fragment, keyword }, index) => {
    const correctAnswer = keyword;
    const distractors = keywords.filter(
      (candidate) => candidate.toLowerCase() !== correctAnswer.toLowerCase(),
    );
    const options = buildOptions(correctAnswer, distractors, index);

    const question = normalizeWhitespace(
      `Question ${index + 1}: Which word or phrase best completes this statement from the content? "${maskKeyword(fragment, keyword)}"`,
    );

    return {
      question,
      options,
      correctIndex: options.findIndex(
        (option) => option.toLowerCase() === correctAnswer.toLowerCase(),
      ),
    };
  });
}

function buildOptions(
  correctAnswer: string,
  distractors: string[],
  questionIndex: number,
): string[] {
  const fallbackDistractors = [
    `concept ${questionIndex + 1}`,
    `topic ${questionIndex + 1}`,
    `detail ${questionIndex + 1}`,
    `keyword ${questionIndex + 1}`,
  ];

  const uniqueDistractors = Array.from(
    new Set(
      [...distractors, ...fallbackDistractors].filter(
        (candidate) => candidate.toLowerCase() !== correctAnswer.toLowerCase(),
      ),
    ),
  ).slice(0, OPTION_COUNT - 1);

  return shuffle([correctAnswer, ...uniqueDistractors]).slice(0, OPTION_COUNT);
}

function extractKeywords(content: string): string[] {
  const tokens = content.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g) ?? [];
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "also",
    "and",
    "are",
    "because",
    "been",
    "before",
    "being",
    "between",
    "could",
    "from",
    "have",
    "into",
    "more",
    "most",
    "other",
    "over",
    "some",
    "such",
    "than",
    "that",
    "their",
    "there",
    "these",
    "they",
    "this",
    "through",
    "very",
    "what",
    "when",
    "where",
    "which",
    "with",
    "would",
  ]);

  const counts = new Map<string, number>();

  for (const token of tokens) {
    const normalized = token.toLowerCase();

    if (normalized.length < 4 || stopWords.has(normalized)) {
      continue;
    }

    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || right[0].length - left[0].length)
    .map(([token]) => token)
    .slice(0, 16);
}

function maskKeyword(fragment: string, keyword: string): string {
  const fragmentLower = fragment.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  const keywordIndex = fragmentLower.indexOf(keywordLower);

  if (keywordIndex === -1) {
    return ensureSentenceEnding(`${fragment} _____`);
  }

  return ensureSentenceEnding(
    `${fragment.slice(0, keywordIndex)}_____${fragment.slice(keywordIndex + keyword.length)}`,
  );
}

function ensureSentenceEnding(value: string): string {
  const trimmed = normalizeWhitespace(value);

  if (!trimmed) {
    return "";
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function shuffle<T>(values: T[]): T[] {
  const items = [...values];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}
