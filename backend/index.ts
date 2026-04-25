import express from "express"
import { tavily } from "@tavily/core"
import { GoogleGenAI } from "@google/genai"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";

const client = tavily({ apiKey: process.env.TAVILY_API})
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

const app = express()
app.use(express.json())

app.post("/purplexity-ask", async function (req, res) {
    // Step 1: Get the query from the user
    const query = req.body.query

    // Step 2: Make sure user has access/credits to hit the endpoint

    // Step 3: Check if we have web search indexed for a similar query

    // Step 4: Web search to gather resources
    const webSearchResponse = await client.search(query, {
        searchDepth: "advanced"
    })

    const webSearchResults = webSearchResponse.results

    // Step 5: Do some context engineering on the prompt + web search responses

    // Step 6: Hit the LLM and stream back the response
    // Hit the LLM ? llm api/openrouter/vercel ai gateway

    const prompt = PROMPT_TEMPLATE
        .replace("{{WEB_SEARCH_RESULTS}}", JSON.stringify(webSearchResults))
        .replace("{{USER_QUERY}}", query)

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
        
    const aiResponse = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_PROMPT,
        }
    });
    
    for await (const chunk of aiResponse) {
        const payload = JSON.stringify({ 
            type: "text",
            text: chunk.text 
        });
        res.write(`data: ${payload}\n\n`);
    }

    // Step 7: Also stream back the sources and followup
    const sourcesPayload = JSON.stringify({
        type: "sources",
        sources: webSearchResults
    })


    res.write(`data: ${sourcesPayload}\n\n`)

    // Step 8: Close the event stream
    res.end()
})

app.listen(3000)