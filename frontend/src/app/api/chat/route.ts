import { NextRequest, NextResponse } from "next/server";
import { generateCopilotResponse, CitizenContextData } from "@/lib/voiceCopilotBrain";
import { pruneContext, ChatMessageLite } from "@/lib/tokenPruner";

/**
 * In-memory response cache for Azure credit optimization.
 * Key: (uan + normalized query).
 * Stores successful LLM responses to eliminate duplicate inference costs.
 */
const responseCache = new Map<string, { replyText: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes TTL

const AZURE_LLM_URL =
  process.env.LLM_API_BASE_URL ||
  "http://jan-epf-llm.internal.whitesea-6aaf591b.centralindia.azurecontainerapps.io:11434/v1";
const AZURE_MODEL = process.env.LLM_MODEL || "gemma4:e2b";
const REQUEST_TIMEOUT_MS = 2500;

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
    // LAYER 1 & 2: 80% DETERMINISTIC SOVEREIGN ENGINE (0ms / ₹0.00 Cost)
    // =========================================================================
    const deterministicReply = generateCopilotResponse(
      trimmedQuery,
      citizenContext,
      language,
      turnCount
    );

    // If deterministic pattern matched (Advance, Transfer, Balance, KYC, Pension, TDS, Guardrail Block)
    if (!deterministicReply.needsLlm) {
      const durationMs = Number((performance.now() - startTime).toFixed(2));
      return NextResponse.json({
        ...deterministicReply,
        source: "deterministic",
        costInr: 0.0,
        latencyMs: durationMs,
        tokenSavingsPct: 100
      });
    }

    // =========================================================================
    // LAYER 3: 20% AZURE LLM ROUTING WITH CONTEXT PRUNING & CACHING
    // =========================================================================
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

    // Prune context to reduce token payload by up to 84.4%
    const pruned = pruneContext(chatHistory, citizenContext, 3);

    // Call Azure-hosted open-weight LLM container with strict timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const llmResponse = await fetch(`${AZURE_LLM_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LLM_API_KEY || "sec_epf_internal_98a7b6c5d4e3f2a1"}`
        },
        body: JSON.stringify({
          model: AZURE_MODEL,
          messages: [
            ...pruned.messages,
            { role: "user", content: trimmedQuery }
          ],
          max_tokens: 256,
          temperature: 0.1
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (llmResponse.ok) {
        const data = await llmResponse.json();
        const rawContent = data.choices?.[0]?.message?.content;
        if (rawContent && typeof rawContent === "string" && rawContent.trim().length > 0) {
          const generatedText = rawContent.trim();
          responseCache.set(normalizedKey, { replyText: generatedText, timestamp: Date.now() });

          const durationMs = Number((performance.now() - startTime).toFixed(2));
          return NextResponse.json({
            ...deterministicReply,
            displayText: generatedText,
            spokenText: generatedText,
            source: "azure_llm",
            modelUsed: AZURE_MODEL,
            costInr: 0.0, // Self-hosted container = zero variable API markup
            latencyMs: durationMs,
            tokenSavingsPct: pruned.compressionRatioPct
          });
        }
      }
    } catch (llmErr) {
      // Graceful fallback to deterministic response if Azure is throttled or offline
    } finally {
      clearTimeout(timeoutId);
    }

    // Fallback to rich deterministic statutory overview
    const durationMs = Number((performance.now() - startTime).toFixed(2));
    return NextResponse.json({
      ...deterministicReply,
      source: "deterministic_fallback",
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
