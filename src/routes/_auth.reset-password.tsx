import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ResetPasswordPage } from "@/features/auth";

const searchSchema = z.object({ token: z.string() });

const ResetPasswordRoute = () => {
  const { token } = Route.useSearch();

  return <ResetPasswordPage token={token} />;
};

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: searchSchema,
  component: ResetPasswordRoute,
});
