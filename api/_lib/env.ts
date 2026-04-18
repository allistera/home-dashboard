const databaseUrlCandidates = [
  process.env.DATABASE_URL,
  process.env.POSTGRES_URL,
  process.env.POSTGRES_PRISMA_URL,
]

export const getDatabaseUrl = () => {
  const url = databaseUrlCandidates.find((candidate) => typeof candidate === 'string' && candidate)

  if (!url) {
    throw new Error(
      'Missing database connection string. Expected DATABASE_URL or POSTGRES_URL from the Neon Vercel integration.',
    )
  }

  return url
}
