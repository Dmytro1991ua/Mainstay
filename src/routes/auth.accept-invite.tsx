import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AcceptInvitePage } from "@/features/auth";

import { AuthLayout } from "./-components/AuthLayout";

const searchSchema = z.object({ token: z.string() });

const AcceptInviteRoute = () => {
  const { token } = Route.useSearch();
  return (
    <AuthLayout skipAuthRedirect>
      <AcceptInvitePage token={token} />
    </AuthLayout>
  );
};

export const Route = createFileRoute("/auth/accept-invite")({
  validateSearch: searchSchema,
  component: AcceptInviteRoute,
});
