import { authApi } from "@/app/lib/api"

export const useUserCache = new Map<string, string>();

export const calculateDuration = (start: string, end: string | null): string => {
  if (!end) return "Ongoing"

  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  const diff = endTime - startTime

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours}h ${minutes}m`
}


// Helper function to calculate energy
//
export const calculateEnergy = (meterStart: number, meterStop: number | null): number => {
  if (!meterStop) return 0
  return (meterStop - meterStart) / 1000 // Convert Wh to kWh
}

export const findUserByIdTag = async (idTag: string): Promise<string | undefined> => {
  if (!idTag) {
    return undefined
  }
  
  if (useUserCache.has(idTag)) {
    const cached = useUserCache.get(idTag)
    return cached === '' ? undefined : cached
  }

  try {
    const response = await authApi.getUserByIdTag(idTag)
    console.log({response})
    const username = response.data.user.username
    useUserCache.set(idTag, username)
    return username
  } catch (error) {
    // Cache empty string to indicate "user not found" and avoid repeated API calls
    useUserCache.set(idTag, '')
    return undefined
  }
}