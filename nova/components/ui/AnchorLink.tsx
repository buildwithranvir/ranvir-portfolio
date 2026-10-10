"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { scrollToHash } from "@/lib/scroll";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: `#${string}` };

/** In-page link that hands scrolling to Lenis (or native scroll when motion is reduced). */
export function AnchorLink({ href, onClick, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    scrollToHash(href);
  };
  return <a href={href} onClick={handle} {...rest} />;
}
