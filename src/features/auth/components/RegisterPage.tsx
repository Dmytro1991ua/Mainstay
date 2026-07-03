import { AuthCard } from "./AuthCard";
import { RegisterForm } from "./RegisterForm";

export const RegisterPage = () => (
  <AuthCard
    title="Create your account"
    subtitle="Set up your account to get started."
    footerText="Already have an account?"
    footerLinkText="Sign in"
    footerLinkTo="/login"
  >
    <RegisterForm />
  </AuthCard>
);
