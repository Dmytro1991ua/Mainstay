import { useAuthStore } from "@/shared/stores/auth-store";

export const useAssetPermissions = () => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);

  return {
    canManage: roles.some((r) => r === "ADMIN" || r === "MANAGER"),
    canDelete: roles.includes("ADMIN"),
  };
};
