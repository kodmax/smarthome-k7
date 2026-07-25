import OpenAI from 'openai'
import { config } from '../config'

let client: OpenAI | undefined

export const initOpenAIClient = (): OpenAI => {
  if (client !== undefined) {
    return client
  }

  client = new OpenAI({
    apiKey: config.openai.apiKey,
  })

  return client
}

export const getOpenAIClient = (): OpenAI => {
  if (client === undefined) {
    throw new Error('OpenAI client is not initialized')
  }

  return client
}

export const getModelList = async (openai = getOpenAIClient()): Promise<string[]> => {
  const modelIds: string[] = []

  for await (const model of openai.models.list()) {
    modelIds.push(model.id)
  }

  return modelIds.sort()
}
