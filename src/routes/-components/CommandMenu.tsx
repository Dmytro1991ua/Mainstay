import { CommandMenu as CommandMenuPrimitive } from "@/shared/ui/command-menu";

import { useCommandMenu } from "./command-menu-provider";
import { useCommandItems } from "./use-command-items";

/** Binds the shared palette primitive to the app's open-state and item set. */
export function CommandMenu() {
  const { open, setOpen } = useCommandMenu();
  const items = useCommandItems();

  return <CommandMenuPrimitive open={open} onOpenChange={setOpen} items={items} />;
}
