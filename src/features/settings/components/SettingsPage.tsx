import { AppearanceCard } from "./AppearanceCard";
import { ProfileCard } from "./ProfileCard";
import { SignOutCard } from "./SignOutCard";

export const SettingsPage = () => (
  <div>
    <h1 className="mb-1 text-2xl font-semibold tracking-tight">Settings</h1>
    <p className="mb-6 text-sm text-text-2">Manage your account and workspace preferences.</p>
    <div className="mx-auto flex max-w-170 flex-col gap-4">
      <ProfileCard />
      <AppearanceCard />
      <SignOutCard />
    </div>
  </div>
);
