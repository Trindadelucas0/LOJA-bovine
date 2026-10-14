"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return await sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return await sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  if (regionMap.has(countryCode)) {
    return regionMap.get(countryCode)
  }

  let regions = await listRegions()

  // The Next.js data cache (force-cache) persists across restarts; if the
  // requested country is missing from a cached list, refetch it fresh once.
  if (
    countryCode &&
    regions &&
    !regions.some((r) => r.countries?.some((c) => c?.iso_2 === countryCode))
  ) {
    regions = await sdk.client
      .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
        method: "GET",
        cache: "no-store",
      })
      .then(({ regions }) => regions)
  }

  if (!regions) {
    return null
  }

  regions.forEach((region) => {
    region.countries?.forEach((c) => {
      regionMap.set(c?.iso_2 ?? "", region)
    })
  })

  const region = countryCode
    ? regionMap.get(countryCode)
    : regionMap.get("us")

  return region
}
