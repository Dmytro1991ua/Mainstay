import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = { to: string };

export const BackButton = ({ to }: BackButtonProps) => (
  <Link
    to={to}
    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent/90"
  >
    <ArrowLeft className="size-4" />
  </Link>
);
