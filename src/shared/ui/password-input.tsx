import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";

import { Input } from "./input";

type PasswordInputProps = {
  id?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  autoComplete?: string;
  disabled?: boolean;
};

export const PasswordInput = ({
  id,
  placeholder,
  registration,
  autoComplete = "off",
  disabled,
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        {...registration}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        disabled={disabled}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-3 transition-colors hover:text-text disabled:pointer-events-none"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      </button>
    </div>
  );
};
