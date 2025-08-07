// modalActionRegistry.ts
const modalActionRegistry: Record<string, () => void> = {};

export function registerModalAction(id: string, callback: () => void) {
  modalActionRegistry[id] = callback;
}

export function runModalAction(id?: string) {
  if (id && modalActionRegistry[id]) {
    modalActionRegistry[id]();
  }
}
