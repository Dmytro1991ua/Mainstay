import type { FieldConfig } from "./types";
import type { LoginFormValues, RegisterFormValues } from "../types/schemas";

export const LOGIN_FORM_FIELDS: FieldConfig<LoginFormValues>[] = [
  {
    name: "email",
    label: "Work Email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@company.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    placeholder: "Enter your password",
  },
];

export const REGISTER_FORM_FIELDS: FieldConfig<RegisterFormValues>[] = [
  { name: "userName", label: "User Name", autoComplete: "username", placeholder: "john.doe" },
  {
    name: "email",
    label: "Work Email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@company.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Create a password",
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Confirm new password",
  },
];
