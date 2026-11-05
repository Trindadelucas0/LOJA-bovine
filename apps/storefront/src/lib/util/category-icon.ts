/** Ícone Material Symbols a partir do nome do departamento. */
export const categoryIcon = (name: string) => {
  const n = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  if (n.includes("solar") || n.includes("fotovolta") || n.includes("painel")) return "solar_power"
  if (n.includes("bateria")) return "battery_charging_full"
  if (n.includes("inversor")) return "electrical_services"
  if (n.includes("vacina")) return "vaccines"
  if (n.includes("vermif") || n.includes("antibiot") || n.includes("mastit")) return "medication"
  if (n.includes("insemin")) return "science"
  if (n.includes("cerca")) return "grid_on"
  if (n.includes("eletric")) return "bolt"
  if (n.includes("sal") || n.includes("nutri") || n.includes("racao")) return "grocery"
  if (n.includes("bebedouro") || n.includes("cocho")) return "water_drop"
  if (n.includes("ferramenta")) return "hardware"
  if (n.includes("veter") || n.includes("saude") || n.includes("animal")) return "pets"
  if (n.includes("agro")) return "agriculture"
  return "category"
}
