import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkTo?: string;
};

export const AuthCard = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthCardProps) => (
  <div>
    <h2 className="mb-1.5 text-2xl font-semibold tracking-tight">{title}</h2>
    <p className="mb-7 text-sm text-text-2">{subtitle}</p>
    {children}
    {footerText && footerLinkText && footerLinkTo && (
      <p className="mt-5 text-center text-[13.5px] text-text-2">
        {footerText}
        <Link to={footerLinkTo} className="font-semibold text-accent">
          {footerLinkText}
        </Link>
      </p>
    )}
  </div>
);
