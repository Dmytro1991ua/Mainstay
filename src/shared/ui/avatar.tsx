import { cn } from "@/shared/lib/utils";

type AvatarProps = {
  initials: string;
  src?: string | null;
  className?: string;
  alt?: string;
  title?: string;
};

export const Avatar = ({ initials, src, className, alt = "Avatar", title }: AvatarProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        title={title}
        className={cn("size-8 shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      title={title}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent",
        className,
      )}
    >
      {initials}
    </div>
  );
};
