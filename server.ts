import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
app.use(express.json());

const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";

function startListening(port: number) {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`[Startup Evaluator] Full-stack Server listening at http://localhost:${port}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy, trying ${nextPort} instead...`);
      startListening(nextPort);
      return;
    }

    console.error("Server startup failed:", error);
    process.exit(1);
  });
}

// Initialize the Gemini SDK
// user-agent must be set to 'aistudio-build' for telemetry as per system instructions
const apiKey = process.env.GEMINI_API_KEY?.trim();

if (process.env.GROK_API_KEY) {
  console.warn("WARNING: GROK_API_KEY is set, but this app uses Google Gemini. Replace it with a real GEMINI_API_KEY from Google AI Studio.");
}

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is missing. The app will use fallback responses until a real key is configured.");
}

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

function isServiceUnavailable(error: any) {
  return Boolean(
    error?.status === 503 ||
    error?.code === 503 ||
    error?.message?.toLowerCase().includes("unavailable") ||
    error?.message?.toLowerCase().includes("high demand") ||
    error?.message?.toLowerCase().includes("try again later")
  );
}

function isQuotaExceeded(error: any) {
  return Boolean(
    error?.status === 429 ||
    error?.code === 429 ||
    error?.status === "RESOURCE_EXHAUSTED" ||
    error?.message?.toLowerCase().includes("quota exceeded") ||
    error?.message?.toLowerCase().includes("exceeded your current quota") ||
    error?.message?.toLowerCase().includes("rate limits")
  );
}

function createChatFallbackResponse() {
  return {
    text: "Evaluator AI is temporarily busy with high demand. The analysis will continue with the built-in fallback guidance for now. Please try again in a minute.",
  };
}

async function generateWithRetry<T>(operation: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      const isRetryable = isQuotaExceeded(error) || isServiceUnavailable(error);
      if (!isRetryable || attempt === retries) {
        throw error;
      }

      const delayMs = 1000 * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

function createOfflineEvaluationFallback() {
  return {
    overallScore: 6.2,
    executiveSummary:
      "Evaluator AI is currently running in fallback mode because GEMINI_API_KEY is not configured. Once a valid Gemini key is added, this scorecard will use live model output.",
    constructiveFeedback:
      "Add your Gemini API key to the project environment to unlock full AI-powered startup analysis.",
    pillars: [
      { name: "Problem Being Solved", score: 6.5, pros: ["Clear pain point"], cons: ["Needs deeper validation"], analysis: "Fallback summary only.", recommendation: "Confirm the target problem with customer interviews." },
      { name: "Target Audience", score: 6.0, pros: ["Well-defined market"], cons: ["Audience size needs proof"], analysis: "Fallback summary only.", recommendation: "Interview at least five potential users." },
      { name: "Market Demand", score: 6.2, pros: ["Relevant trend"], cons: ["Demand signals need quantification"], analysis: "Fallback summary only.", recommendation: "Measure willingness to pay and funnel conversion." },
      { name: "Competitors", score: 6.0, pros: ["Competitive space exists"], cons: ["Differentiation should be sharper"], analysis: "Fallback summary only.", recommendation: "Map the top three alternatives and your unfair advantage." },
      { name: "Uniqueness (USP)", score: 6.4, pros: ["Promising differentiator"], cons: ["Moat needs evidence"], analysis: "Fallback summary only.", recommendation: "Document why customers would choose you over alternatives." },
      { name: "Revenue Model", score: 6.1, pros: ["Viable monetization path"], cons: ["Pricing assumptions need proof"], analysis: "Fallback summary only.", recommendation: "Validate pricing, LTV, and CAC assumptions." },
      { name: "Feasibility", score: 6.3, pros: ["Buildable concept"], cons: ["Execution risks remain"], analysis: "Fallback summary only.", recommendation: "Prototype the core workflow and test the first milestone." },
      { name: "Scalability", score: 6.0, pros: ["Growth path is plausible"], cons: ["Scaling costs need better proof"], analysis: "Fallback summary only.", recommendation: "Model unit economics and expansion paths." },
      { name: "Risks", score: 5.8, pros: ["Risk areas are identifiable"], cons: ["Key dependencies still need validation"], analysis: "Fallback summary only.", recommendation: "Rank the top three execution risks and build a mitigation plan." },
    ],
    nextSteps: [
      "Add a real GEMINI_API_KEY to your environment.",
      "Restart the dev server to enable live AI scoring.",
      "Re-run the diagnosis after the API key is configured.",
    ],
  };
}

// Primary System instructions for the chat model
const SYSTEM_INSTRUCTION = `You are "Evaluator AI", an elite startup advisor, silicon valley venture capitalist, and incubator director. 
Your primary purpose is to help the user talk through, brainstorm, and refine their startup ideas, and guide them towards evaluation.

CRITICAL DIRECTIVES:
1. ONLY answer startup, business, venture planning, entrepreneurship, or product development related questions.
2. If the user asks about an entirely unrelated topic (e.g. personal queries, cooking recipes, general jokes, solving complex math equations, writing pure code unrelated to business/app design), politely but firmly decline to answer. Say: "I'm designed exclusively to help brainstorm and evaluate startup ideas. Let's get back to your venture concept! What problem are you trying to solve?"
3. Guide them through the 9 key dimensions of a robust startup:
   - Problem Being Solved
   - Target Audience
   - Market Demand
   - Competitors
   - Uniqueness (USP)
   - Revenue Model
   - Feasibility
   - Scalability
   - Risks
4. Support, inspire, yet remain rigorous and realistic. Use structured VC vocabulary (TAM, SAM, CAC, LTV, unit economics, defensibility, unfair advantages) where helpful.
5. If the user asks you to grade their idea or give scores, encourage them by giving a verbal assessment and telling them they can click "Run 9-Pillar Diagnosis" or "Analyze Pitch" on the sidebar dashboard to get an instant comprehensive evaluation scorecard with progress bars and customized feedback.`;

// 1. Chat API Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request payload. 'messages' array is required." });
    }

    if (!ai) {
      return res.status(200).json(createChatFallbackResponse());
    }

    // Format chat messages for Gemini
    // Ensure roles are strictly 'user' and 'model' as required by @google/genai
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await generateWithRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
          maxOutputTokens: 512,
        },
      })
    );

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);

    if (isQuotaExceeded(error) || isServiceUnavailable(error)) {
      return res.status(200).json(createChatFallbackResponse());
    }

    res.status(500).json({ error: error.message || "An error occurred with the AI agent." });
  }
});

// 2. Structured Evaluation API Endpoint
app.post("/api/evaluate", async (req, res) => {
  try {
    const { ideaName, pitchText, chatHistory } = req.body;
    
    if (!pitchText && !chatHistory) {
      return res.status(400).json({ error: "Please provide either a startup pitch or conversation history to evaluate." });
    }

    if (!ai) {
      return res.json(createOfflineEvaluationFallback());
    }

    const evaluationPrompt = `
You are a highly analytical and experienced Venture Capitalist and Startup Strategist.
Evaluate the following startup concept based STRICTLY on the 9 designated dimensions:
1. Problem Being Solved (Is it a real, painful problem? Who suffers from it?)
2. Target Audience (Is the profile clear, accessible, and large enough?)
3. Market Demand (Are there signals of willingness to pay or huge macro trends?)
4. Competitors (Who are they? Direct, indirect, alternatives?)
5. Uniqueness (USP) (Is there a clear moat, secret sauce, or deep differentiator?)
6. Revenue Model (Are monetization streams clear, logical, and scalable?)
7. Feasibility (Can it be built? Tech complexity, execution hurdles, regulatory barriers?)
8. Scalability (Is it high margin? Can it grow exponentially without linear cost increases?)
9. Risks (What can kill this company? Security, trust, adoption, platform dependency?)

CONTEXT FOR EVALUATION:
- Startup Name/Working Title: ${ideaName || "Untitled Venture"}
- Core Pitch/Self description: ${pitchText || "Not provided directly. Parse from chat history."}
- Ongoing Brainstorming & Dialogue Context: 
${chatHistory || "No chat history provided."}

YOUR TASKS:
1. Formulate a rigorous score between 0 and 10 for EACH of the 9 pillars.
2. Be objective and constructively critical. Awarding 10s should be extremely rare (reserved for globally flawless ideas). Normal viable startups score 6-8. Ideas with major unaddressed hurdles should score 3-5.
3. For each pillar, write a clear analysis (clinical explanation of why that score was awarded) and custom recommendation (prescriptive next step to improve that score).
4. Provide 2-3 specific Pros and 2-3 custom Cons/Risks for each dimension, showing you understand the unique trade-offs.
5. Formulate an absolute, unbiased overallScore (out of 10) representing the overall viability.
6. Provide an Executive Summary (1-2 paragraphs) and actionable constructive feedback.
7. Outline 3 to 5 realistic next steps.

Produce your analysis strictly in JSON format matching the response schema. No extra text, headers, or markdown formatting outside the JSON output.
`;

    const response = await generateWithRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: evaluationPrompt,
        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 1500,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: {
                type: Type.NUMBER,
                description: "Weighted or averaged viability score across all pillars, between 0 and 10.",
              },
              executiveSummary: {
                type: Type.STRING,
                description: "A comprehensive high-level summary of the venture concept, its timing, and strategic outlook.",
              },
              constructiveFeedback: {
                type: Type.STRING,
                description: "Major encouraging feedback, detailing the single biggest opportunity and the heaviest obstacle to address first.",
              },
              pillars: {
                type: Type.ARRAY,
                description: "Evaluation metrics and analysis for the 9 distinct criteria. MUST evaluate ALL 9 pillars exactly.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: {
                      type: Type.STRING,
                      description: "Strictly one of: 'Problem Being Solved', 'Target Audience', 'Market Demand', 'Competitors', 'Uniqueness (USP)', 'Revenue Model', 'Feasibility', 'Scalability', 'Risks'.",
                    },
                    score: {
                      type: Type.NUMBER,
                      description: "Score representing strength in this dimension (0 to 10). Decimal allowed.",
                    },
                    pros: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "2 or 3 distinct positive elements, strengths, or structural advantages.",
                    },
                    cons: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "2 or 3 critical concerns, areas to validate, or distinct challenges.",
                    },
                    analysis: {
                      type: Type.STRING,
                      description: "A tight, high-caliber, objective paragraphs explaining this score.",
                    },
                    recommendation: {
                      type: Type.STRING,
                      description: "A precise, specific action item the founder can complete to increase this score and de-risk this pillar.",
                    },
                  },
                  required: ["name", "score", "pros", "cons", "analysis", "recommendation"],
                },
              },
              nextSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 to 5 clear, actionable next steps or validation test descriptions.",
              },
            },
            required: ["overallScore", "executiveSummary", "constructiveFeedback", "pillars", "nextSteps"],
          },
        },
      })
    );

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response received from the evaluation model.");
    }

    const evaluationJSON = JSON.parse(resultText);
    res.json(evaluationJSON);
  } catch (error: any) {
    console.error("Error in /api/evaluate:", error);

    if (isQuotaExceeded(error) || isServiceUnavailable(error)) {
      return res.status(200).json(createOfflineEvaluationFallback());
    }

    res.status(500).json({ error: error.message || "An error occurred during startup evaluation." });
  }
});

// Setup Vite Dev Server / Static Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  startListening(DEFAULT_PORT);
}

startServer();
