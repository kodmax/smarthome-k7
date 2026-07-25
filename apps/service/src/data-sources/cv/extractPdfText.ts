import type OpenAI from 'openai'

const CV_EXTRACTION_MODEL = 'gpt-5.6-terra'

const CV_EXTRACTION_PROMPT = `
Extract all visible text from this PDF document.
Return only plain text. Do not summarize, rewrite, correct, infer, or add any content.
Preserve the document's logical reading order, section headings, paragraph breaks, bullet points, job titles, company names, and dates where possible.
For multi-column layouts, reconstruct the natural reading order rather than following raw PDF object order.
Do not use Markdown formatting. Do not include explanations, comments, or extraction notes.
`

export async function extractPdfText(openai: OpenAI, base64: string): Promise<string> {
  const response = await openai.responses.create({
    model: CV_EXTRACTION_MODEL,
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_file',
            filename: 'cv.pdf',
            file_data: `data:application/pdf;base64,${base64}`,
          },
          {
            type: 'input_text',
            text: CV_EXTRACTION_PROMPT,
          },
        ],
      },
    ],
  })

  const text = response.output_text.trim()
  if (text.length === 0) {
    throw new Error('OpenAI returned empty CV text')
  }

  return text
}
