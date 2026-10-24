import { GoogleGenAI, ThinkingLevel } from '@google/genai'

// Gemini Flash-Lite model — available on the Gemini API free tier
const MODEL = 'gemini-3.5-flash-lite'

// Keeps the API key on the server — it never reaches the browser
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const MIN_TEXT_LENGTH = 100

// Added to every instruction so the frontend gets clean text it can display
// as-is, and the summary is written in new words instead of copied
const PLAIN_TEXT_RULE =
  'Use plain text only. No bold, italics or headings. Never repeat the original sentences.'

// Turns the "Short" / "Medium" / "Detailed" choice into an instruction for the model.
// Each limit is a share of the original length so the summary is always much shorter.
const LENGTH_INSTRUCTIONS = {
  short: `Summarize the text in exactly 3 bullet points, each under 12 words, under 30 words total and at most 15% of the original length. ${PLAIN_TEXT_RULE}`,
  medium: `Summarize the text in one paragraph, at most 30% of the original length and no more than 120 words. ${PLAIN_TEXT_RULE}`,
  detailed: `Summarize the text in 4-8 bullet points, at most 50% of the original length. ${PLAIN_TEXT_RULE}`,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST requests are allowed.' })
    return
  }

  const { text, length } = req.body ?? {}

  if (typeof text !== 'string' || text.trim().length < MIN_TEXT_LENGTH) {
    res.status(400).json({
      error: `Please provide at least ${MIN_TEXT_LENGTH} characters of text to summarize.`,
    })
    return
  }

  const instruction = LENGTH_INSTRUCTIONS[length?.toLowerCase()]
  if (!instruction) {
    res.status(400).json({ error: 'Length must be one of: short, medium, detailed.' })
    return
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: text,
      config: {
        systemInstruction: `You are a helpful summarization assistant. ${instruction}`,
        maxOutputTokens: 1024,
        // Summarizing doesn't need deep reasoning; low thinking keeps responses
        // fast and leaves the output token budget for the summary itself
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    })

    // response.text joins all the text parts of the reply into one string
    const summary = response.text ?? ''

    res.status(200).json({ summary })
  } catch (error) {
    console.error('Gemini API error:', error)
    res.status(500).json({ error: 'Failed to generate a summary. Please try again.' })
  }
}
