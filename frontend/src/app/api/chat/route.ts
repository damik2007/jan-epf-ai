import { NextRequest, NextResponse } from "next/server";
import { generateCopilotResponse, CitizenContextData } from "@/lib/voiceCopilotBrain";
import { pruneContext, ChatMessageLite } from "@/lib/tokenPruner";

/**
 * In-memory response cache for LLM credit and latency optimization.
 * Key: (uan + normalized query).
 */
const responseCache = new Map<string, { replyText: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes TTL

const AZURE_LLM_URL =
  process.env.LLM_API_BASE_URL ||
  "http://jan-epf-llm.internal.whitesea-6aaf591b.centralindia.azurecontainerapps.io:11434/v1";
const AZURE_MODEL = process.env.LLM_MODEL || "gemma4:e2b";

export async function POST(req: NextRequest) {
  const startTime = performance.now();

  try {
    const body = await req.json();
    const {
      message = "",
      citizenContext,
      chatHistory = [],
      language = "en-IN",
      turnCount = 1
    }: {
      message: string;
      citizenContext: CitizenContextData;
      chatHistory: ChatMessageLite[];
      language: string;
      turnCount: number;
    } = body;

    const trimmedQuery = (message || "").trim();
    if (!trimmedQuery) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    // =========================================================================
    // LAYER 1 & 2: DETERMINISTIC SOVEREIGN ACTUARY CORE (0ms / ₹0.00 Cost)
    // =========================================================================
    const deterministicReply = generateCopilotResponse(
      trimmedQuery,
      citizenContext,
      language,
      turnCount
    );

    // Check Cache
    const normalizedKey = `${citizenContext.uan}:${trimmedQuery.toLowerCase().replace(/\s+/g, " ")}`;
    const cached = responseCache.get(normalizedKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      const durationMs = Number((performance.now() - startTime).toFixed(2));
      return NextResponse.json({
        ...deterministicReply,
        displayText: cached.replyText,
        spokenText: cached.replyText,
        source: "cache_hit",
        costInr: 0.0,
        latencyMs: durationMs,
        tokenSavingsPct: 100
      });
    }

    // Prune context for token efficiency
    const pruned = pruneContext(chatHistory, citizenContext, 3);

    // Build rich, intelligent persona system prompt (6-Layer Sovereign Harness: Glean Context + Devin ReAct)
    const enrichedSystemPrompt = `You are Jan-EPF AI Agent, a sovereign conversational AI agent for Indian citizens and EPF members.
Active Citizen Profile:
- Name: ${citizenContext.name}
- UAN: ${citizenContext.uan}
- EPF Balance: ₹${citizenContext.balance?.toLocaleString("en-IN")}
- Active Employer: ${citizenContext.employer}
- Continuous Service: ${citizenContext.serviceYears} years
- 3-Way Passbook Split: Employee (₹${citizenContext.empShare || 0}), Employer (₹${citizenContext.emprShare || 0}), EPS-95 (₹${citizenContext.epsShare || 0})
- KYC Status: ${citizenContext.kycStatus || 'Verified'}
- 0% TDS Status: ${citizenContext.serviceYears && citizenContext.serviceYears >= 5 ? 'Active (Eligible)' : 'Inactive (< 5 years)'}

Statutory Fact Sheet (Pre-Calculated Ground Truth):
${deterministicReply.displayText}

Guidelines:
1. Speak warmly, intelligently, and conversationally as a true Sovereign AI Agent (not a static bot).
2. Ground all mathematical figures and legal facts in the Fact Sheet above.
3. If the user asks "who are you", "what can you do", or asks general questions, explain your capabilities and how you help them manage their EPF with 0ms math and zero employer friction.
4. Keep the response crisp, concise, well-structured, and helpful (under 180 words).
5. Format your output cleanly in markdown with bullet points where appropriate.`;

    let generatedText = "";
    let modelUsed = "";

    const openAiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. Try OpenAI API if key available
    if (openAiKey && !generatedText) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: enrichedSystemPrompt },
              ...pruned.messages.filter((m) => m.role !== "system"),
              { role: "user", content: trimmedQuery }
            ],
            temperature: 0.4,
            max_tokens: 350
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            generatedText = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
            modelUsed = "openai/gpt-4o-mini";
          }
        }
      } catch (err) {
        console.warn("[LLM] OpenAI attempt failed, proceeding to fallback:", err);
      }
    }

    // 2. Try Groq Open-Weight Engine (OpenAI OSS 120B / Groq Compound / Qwen 3.6)
    if (groqKey && !generatedText) {
      const groqModels = ["openai/gpt-oss-120b", "groq/compound-mini", "qwen/qwen3.6-27b"];
      for (const groqModel of groqModels) {
        if (generatedText) break;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey}`
            },
            body: JSON.stringify({
              model: groqModel,
              messages: [
                { role: "system", content: enrichedSystemPrompt },
                ...pruned.messages.filter((m) => m.role !== "system"),
                { role: "user", content: trimmedQuery }
              ],
              temperature: 0.3,
              max_tokens: 450
            }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (groqRes.ok) {
            const data = await groqRes.json();
            const content = data.choices?.[0]?.message?.content?.trim();
            if (content) {
              generatedText = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
              modelUsed = `groq/${groqModel}`;
              break;
            }
          }
        } catch (err) {
          console.warn(`[LLM] Groq (${groqModel}) attempt failed:`, err);
        }
      }
    }

    // 3. Try Azure Self-Hosted Container LLM (Central India Sovereign Edge)
    if (!generatedText && process.env.LLM_API_BASE_URL) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const azureRes = await fetch(`${AZURE_LLM_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.LLM_API_KEY || "sec_epf_internal"}`
          },
          body: JSON.stringify({
            model: AZURE_MODEL,
            messages: [
              { role: "system", content: enrichedSystemPrompt },
              ...pruned.messages.filter((m) => m.role !== "system"),
              { role: "user", content: trimmedQuery }
            ],
            temperature: 0.2,
            max_tokens: 300
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (azureRes.ok) {
          const data = await azureRes.json();
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            generatedText = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
            modelUsed = `azure/${AZURE_MODEL}`;
          }
        }
      } catch (err) {
        console.warn("[LLM] Azure self-hosted attempt failed:", err);
      }
    }

    // 4. Sovereign Edge Actuary Fallback
    if (!generatedText) {
      generatedText = deterministicReply.displayText;
      modelUsed = "sovereign_deterministic_core";
    } else {
      responseCache.set(normalizedKey, { replyText: generatedText, timestamp: Date.now() });
    }

    const durationMs = Number((performance.now() - startTime).toFixed(2));

    return NextResponse.json({
      ...deterministicReply,
      displayText: generatedText,
      spokenText: deterministicReply.spokenText || generatedText,
      source: modelUsed.startsWith("sovereign") ? "deterministic" : "llm_enriched",
      modelUsed,
      costInr: 0.0,
      latencyMs: durationMs,
      tokenSavingsPct: pruned.compressionRatioPct
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to process chat request", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
