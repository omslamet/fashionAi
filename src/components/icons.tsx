import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l-4 4-1 3 2 2 2-2 1-1 2 2h2l1-1 1 1-1 3-2 2-1 1-2-2-1 1-2 2" />
      <path d="M12 22l4-4 1-3-2-2-2 2-1 1-2-2H8l-1 1-1-1 1-3 2-2 1-1 2 2" />
    </svg>
  );
}
