import { AuthCard } from "./AuthCard";
import { LoginForm } from "./LoginForm";

export const LoginPage = () => (
  <AuthCard
    title="Welcome back"
    subtitle="Sign in to your operations workspace."
    footerText="New to Mainstay?"
    footerLinkText="Create an account"
    footerLinkTo="/register"
  >
    <LoginForm />
  </AuthCard>
);
