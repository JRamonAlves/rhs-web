import { getCategoryIcon, type AppIcon } from "@/lib/services"

import { servicesRouting } from "./api.config"

export type Service = {
  name: string
  description: string
  category: string
  icon: AppIcon
  url: string
}

export async function getServices(): Promise<Service[]> {
  const response = await fetch(servicesRouting.getServicesUrl())

  if (!response.ok) {
    throw new Error(`${response.status}`)
  }

  const services: Omit<Service, "icon">[] = await response.json()

  return services.map((service) => ({
    ...service,
    icon: getCategoryIcon(service.category),
  }))
}

export async function getServicesCount(): Promise<number> {
  const response = await fetch(servicesRouting.getServiceCountsUrl())

  if (!response.ok) {
    throw new Error(`${response.status}`)
  }

  return response.json()
}
