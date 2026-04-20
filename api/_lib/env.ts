const databaseUrlCandidates = [
  process.env.DATABASE_URL,
  process.env.POSTGRES_URL,
  process.env.POSTGRES_PRISMA_URL,
]

const resolveDatabaseUrl = () =>
  databaseUrlCandidates.find((candidate): candidate is string => typeof candidate === 'string' && candidate.length > 0)

export const hasDatabaseUrl = () => Boolean(resolveDatabaseUrl())

export const getDatabaseUrl = () => {
  const url = resolveDatabaseUrl()

  if (!url) {
    throw new Error(
      'Missing database connection string. Expected DATABASE_URL or POSTGRES_URL from the Neon Vercel integration.',
    )
  }

  return url
}
