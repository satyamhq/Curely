import OpenAI from 'openai'

// This module is server-only. Never import it in client components.
// The key is read from process.env at runtime — never hardcoded.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default openai
