import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  title?: string;
};

export function ChevronLeft({ size = 20, title, ...props }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      fill="currentColor"
      height={size}
      role={title ? "img" : undefined}
      viewBox="0 -960 960 960"
      width={size}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M576-240 336-480l240-240 51 51-189 189 189 189-51 51Z" />
    </svg>
  );
}

export function ChevronRight({ size = 20, title, ...props }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      fill="currentColor"
      height={size}
      role={title ? "img" : undefined}
      viewBox="0 -960 960 960"
      width={size}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M522-480 333-669l51-51 240 240-240 240-51-51 189-189Z" />
    </svg>
  );
}

export function CloseIcon({ size = 20, title, ...props }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      fill="currentColor"
      height={size}
      role={title ? "img" : undefined}
      viewBox="0 -960 960 960"
      width={size}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
    </svg>
  );
}
