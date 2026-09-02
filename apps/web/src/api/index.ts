export const generateSearchParams = (query?: Record<string, string | number | boolean | null | undefined>) => {
  if (!query) return ""

  const searchParams = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, value.toString())
    }
  })

  return "?" + searchParams.toString()
}
