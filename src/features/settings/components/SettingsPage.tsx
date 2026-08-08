import { useIsDemoAccount } from "@/shared/hooks/use-is-demo-account";
import { Alert } from "@/shared/ui/alert";
import { PageShell } from "@/shared/ui/page-shell";

import { DEMO_ACCOUNT_NOTICE } from "../config";

import { AppearanceCard } from "./AppearanceCard";
import { ChangePasswordCard } from "./ChangePasswordCard";
import { DeleteAccountCard } from "./DeleteAccountCard";
import { ProfileCard } from "./ProfileCard";
import { ProfileEditCard } from "./ProfileEditCard";
import { SignOutAllDevicesCard } from "./SignOutAllDevicesCard";
import { SignOutCard } from "./SignOutCard";

export const SettingsPage = () => {
  const isDemo = useIsDemoAccount();

  return (
    <PageShell
      title="Settings"
      subtitle="Manage your account and workspace preferences."
      variant="plain"
      alert={
        isDemo ? (
          <div className="mx-auto max-w-275">
            <Alert variant="info">{DEMO_ACCOUNT_NOTICE}</Alert>
          </div>
        ) : null
      }
    >
      <div className="mx-auto grid max-w-275 grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <ProfileCard />
        </div>
        <ProfileEditCard />
        <ChangePasswordCard />
        <AppearanceCard />
        <SignOutCard />
        <SignOutAllDevicesCard />
        <DeleteAccountCard />
      </div>
    </PageShell>
  );
};
