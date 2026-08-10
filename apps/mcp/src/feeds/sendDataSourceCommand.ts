import { serviceApiUrl } from '../config.js'

export async function sendDataSourceCommand(sourceId: string, name: string, body?: unknown): Promise<void> {
  const response = await fetch(`${serviceApiUrl}/data-sources/${sourceId}/command/${name}`, {
    method: 'POST',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(`Command ${sourceId}.${name} failed with status ${response.status}`)
  }
}
