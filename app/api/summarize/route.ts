import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { transcript } = await req.json();

        const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.ARK_API_KEY}`
            },
            body: JSON.stringify({
                model: "doubao-seed-1-6-lite-251015",
                messages: [
                    {
                        role: "system",
                       content: `# Role
                                You are a professional knowledge curator. You extract core wisdom and actionable guides from transcripts.

                                # Task
                                Summarize the provided transcript depthly.

                                # Constraints (STRICT)
                                1. **Language Isolation**: 
                                - If the input transcript is English, the ENTIRE response must be in English. 
                                - If the input transcript is Chinese, the ENTIRE response must be in Chinese.
                                - DO NOT mix languages. DO NOT provide Chinese explanations for English content.
                                2. **Markdown Hierarchy**: Use only '##' for main sections and '###' for subsections. DO NOT use '####' or '#####'.
                                3. **Quality**: Ignore filler words. Maintain a professional tone.

                                # Format (Translate these headers to the target language)
                                ## One-Sentence Gold
                                [One sentence summary]

                                ## Core Arguments
                                ### [Argument Title 1]
                                [Detailed Analysis]
                                ### [Argument Title 2]
                                [Detailed Analysis]

                                ## Key Data & Evidence
                                [List of facts/data]

                                ## Actionable Advice
                                [3 practical steps]`
                    },
                    {
                        role: "user",
                        content: transcript
                    }
                ],
                stream: true
            })
        });

        // 直接透传火山引擎的 ReadableStream
        return new Response(response.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}