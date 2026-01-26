"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

export default function EventCardLink({ href, className, children, ariaLabel }: Props) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(href);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNavigate();
        }
      }}
      className={`cursor-pointer ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
