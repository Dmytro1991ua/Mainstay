import type { components } from "@/shared/types/api-generated";

type InventoryItem = components["schemas"]["InventoryItem"];

const NAMES = [
  "Cordless Drill", "HVAC Air Filter", "Elevator Traction Cable", "Hydraulic Seal Kit",
  "LED Work Light", "Safety Harness", "Torque Wrench", "Bearing Assembly", "Door Roller Set",
  "Control Relay", "Circuit Breaker 20A", "Grease Cartridge", "V-Belt 4L360", "Limit Switch",
  "Contactor 40A", "Encoder Module", "Brake Pad Set", "Guide Shoe Insert", "Pit Ladder Rung",
  "Governor Rope", "Buffer Spring", "Interlock Contact", "Push Button Module", "Landing Lantern",
  "Cab Fan Motor", "Position Sensor", "Overload Relay", "Terminal Block", "Fuse 10A",
  "Signal Cable 8-core", "Retiring Cam", "Door Operator Belt", "Rail Clip", "Fishplate Bolt",
  "Selector Tape", "Compensating Chain", "Deflector Sheave", "Emergency Light Battery",
  "Phone Line Module", "Inspection Box", "Load Weighing Sensor", "Vane Sensor", "Roller Guide",
  "Motor Brush Set", "Thermal Sensor", "Ribbon Cable", "Door Gib", "Sill Threshold",
  "Handrail Bracket", "Step Chain Link", "Comb Plate", "Skirt Panel", "Newel Bearing",
  "Drive Chain", "Tension Sprocket", "Balustrade Glass", "Caution Decal",
];

/**
 * Deterministic in-memory inventory dataset for the dev MSW mock (no backend in
 * this sandbox). Quantities/min-levels/dates are derived from the index so the
 * data is stable across reloads and some rows land below their min-stock level.
 */
export const INVENTORY_ITEMS: InventoryItem[] = NAMES.map((name, i) => {
  const minStockLevel = 5 + (i % 4) * 3;
  // every 5th item is intentionally below its min-stock level
  const quantity = i % 5 === 0 ? Math.max(0, minStockLevel - (1 + (i % 3))) : minStockLevel + (i % 11);
  const created = new Date(2025, 0, 1 + i * 3, 9, 0, 0); // spread across the year, no Date.now()
  return {
    id: `inv-${String(i + 1).padStart(3, "0")}`,
    name,
    serialNumber: `SN-${String(1000 + i * 7)}`,
    quantity,
    minStockLevel,
    createdAt: created.toISOString(),
    updatedAt: created.toISOString(),
  };
});
