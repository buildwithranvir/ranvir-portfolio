import type { CSSProperties, ReactNode } from "react";

type Props = {
  paint: string;
  /** Small mono line at the top of the label, e.g. "RK-01". */
  code?: string;
  /** The big name on the label. */
  name?: string;
  /** Small mono line under the name. */
  sub?: string;
  /** Anything shown on the painted part (a preview, a wordmark). */
  children?: ReactNode;
  className?: string;
  labelClassName?: string;
  style?: CSSProperties;
};

/** A paint chip from a fan deck: a painted body, a white label strip, a rivet hole. */
export function Chip({ paint, code, name, sub, children, className = "", labelClassName = "", style }: Props) {
  return (
    <div className={`chip ${className}`} style={{ "--paint": paint, ...style } as CSSProperties}>
      <div className="relative min-h-0 flex-1">{children}</div>
      {(code || name || sub) && (
        <div className={`chip-label px-3 pb-3 pt-2.5 ${labelClassName}`}>
          <div className="flex items-center justify-between gap-2">
            {code && <span className="mono text-[0.62rem] text-dust">{code}</span>}
            <span aria-hidden className="chip-hole shrink-0" />
          </div>
          {name && <p className="display mt-1 truncate text-[1.6em] leading-[0.9]">{name}</p>}
          {sub && <p className="mono mt-1 truncate text-[0.6rem] text-dust">{sub}</p>}
        </div>
      )}
    </div>
  );
}
