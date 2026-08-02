import { useIsDemoAccount } from "@/shared/hooks/use-is-demo-account";
import { Alert } from "@/shared/ui/alert";

import { DEMO_ACCOUNT_NOTICE } from "../config";

import { AppearanceCard } from "./AppearanceCard";
import { ChangePasswordCard } from "./ChangePasswordCard";
import { ProfileCard } from "./ProfileCard";
import { ProfileEditCard } from "./ProfileEditCard";
import { SignOutCard } from "./SignOutCard";

export const SettingsPage = () => {
  const isDemo = useIsDemoAccount();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mb-6 text-sm text-text-2">Manage your account and workspace preferences.</p>
      {isDemo && (
        <div className="mx-auto mb-4 max-w-275">
          <Alert variant="info">{DEMO_ACCOUNT_NOTICE}</Alert>
        </div>
      )}
      <div className="mx-auto grid max-w-275 grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <ProfileCard />
        </div>
        <ProfileEditCard />
        <ChangePasswordCard />
        <AppearanceCard />
        <SignOutCard />
      </div>
    </div>
  );
};
