import type { FieldConfig } from "./types";
import type { AcceptInviteFormValues, LoginFormValues, RegisterFormValues } from "../types/schemas";

const demoPass = import.meta.env.VITE_DEMO_PASS ?? "";

export const DEMO_ACCOUNTS = [
  { label: "Technician", email: import.meta.env.VITE_DEMO_TECHNICIAN_EMAIL ?? "", pass: demoPass },
  { label: "Manager", email: import.meta.env.VITE_DEMO_MANAGER_EMAIL ?? "", pass: demoPass },
];

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

export const ACCEPT_INVITE_FIELDS: FieldConfig<AcceptInviteFormValues>[] = [
  { name: "userName", label: "Username", autoComplete: "username", placeholder: "e.g. johndoe" },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Min. 8 chars, 1 uppercase, 1 number",
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Repeat password",
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
