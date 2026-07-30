import { useUiStore } from "@/shared/stores/ui-store";

import { THEME_OPTIONS } from "../config";

import { SettingCard } from "./SettingCard";
import { SettingRow } from "./SettingRow";
import { SettingToggleGroup } from "./SettingToggleGroup";

export const AppearanceCard = () => {
  const { themePreference, setThemePreference } = useUiStore();

  return (
    <SettingCard>
      <h3 className="mb-1 text-[14px] font-semibold">Appearance</h3>
      <SettingRow title="Theme" description="Matches your OS setting, or pick a fixed mode">
        <SettingToggleGroup
          options={THEME_OPTIONS}
          value={themePreference}
          onChange={setThemePreference}
        />
      </SettingRow>
    </SettingCard>
  );
};
