import { useAuthStore } from "@/shared/stores/auth-store";
import { Skeleton } from "@/shared/ui/skeleton";
import { Switch } from "@/shared/ui/switch";

import { NOTIFICATION_PREFERENCE_CONFIG } from "../config";
import { useNotificationPreferences } from "../hooks/use-notification-preferences";

import { SettingCard } from "./SettingCard";
import { SettingRow } from "./SettingRow";

export const NotificationPreferencesCard = () => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);
  const isTechnician =
    roles.includes("TECHNICIAN") && !roles.some((r) => r === "ADMIN" || r === "MANAGER");

  const { preferences, isPending, update } = useNotificationPreferences();

  const visibleConfig = isTechnician
    ? NOTIFICATION_PREFERENCE_CONFIG.filter((c) => !c.technicianHidden)
    : NOTIFICATION_PREFERENCE_CONFIG;

  return (
    <SettingCard>
      <h3 className="mb-1 text-[14px] font-semibold">Notification Preferences</h3>
      <p className="mb-2 text-[12px] text-text-3">
        Choose which notifications you receive. Changes save automatically.
      </p>
      {isTechnician && (
        <p className="mb-3 text-[12px] text-text-3">
          Inventory alerts are managed by your administrator.
        </p>
      )}
      {isPending ? (
        <div className="space-y-4 pt-1">
          {visibleConfig.map((c) => (
            <div key={c.key} className="flex items-center justify-between py-2.5">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-5 w-9 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        visibleConfig.map(({ key, label, description }, i) => (
          <SettingRow key={key} title={label} description={description} border={i > 0}>
            <Switch
              checked={preferences[key]}
              onCheckedChange={(checked) => update({ [key]: checked })}
            />
          </SettingRow>
        ))
      )}
    </SettingCard>
  );
};
