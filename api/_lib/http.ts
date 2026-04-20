export type ApiRequest = {
  method?: string
  query: Record<string, string | string[] | undefined>
  body?: Record<string, unknown> | null
}

export type ApiResponse = {
  status(code: number): ApiResponse
  json(body: unknown): ApiResponse
  setHeader(name: string, value: string): void
}
