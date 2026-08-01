import { useAuthStore } from "@/shared/stores/auth-store";

const DEMO_EMAILS = [
  import.meta.env.VITE_DEMO_TECHNICIAN_EMAIL,
  import.meta.env.VITE_DEMO_MANAGER_EMAIL,
].filter(Boolean) as string[];

export const useIsDemoAccount = () => {
  const email = useAuthStore((s) => s.user?.email ?? "");

  return DEMO_EMAILS.includes(email);
};
