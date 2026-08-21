export const PhotoLink = ({ href, alt }: { href: string; alt: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="block max-w-xs overflow-hidden rounded-lg border border-border"
  >
    <img src={href} alt={alt} className="w-full object-cover" />
  </a>
);
