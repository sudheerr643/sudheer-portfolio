import type { CSSProperties, ReactNode } from "react";
import { BentoCard } from "./BentoCard";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="100 20 300 475" className={className} fill="currentColor" aria-label="Sudheer logo" role="img">
      <path d="M395.285 24.3494C395.917 24.5468 395.657 24.3723 396.075 24.8578C395.995 29.073 396.24 33.0898 396.24 37.2838L396.185 70.7413C396.187 75.5755 396.532 86.0573 395.807 90.3818C394.48 92.2865 389.75 96.0515 387.745 97.769L374.322 109.291L328.74 148.481C321.932 154.367 314.167 160.631 307.65 166.707C298.15 175.564 288.925 187.45 288.435 200.935C287.327 214.392 298.552 226.448 309.202 233.31C318.217 239.118 325.227 242.879 333.055 250.993C357.342 276.163 345.727 306.245 327.032 330.293C316.275 344.133 305.69 353.603 292.932 365.358L262.702 393.228L168.332 480.238C165.562 482.588 162.978 485.183 160.132 487.548C160.263 482.633 160.121 477.368 160.134 472.403L160.163 436.953C160.163 434.46 159.951 421.895 160.441 420.383C161.323 417.665 175.115 405.505 177.563 403.133C191.625 389.458 205.788 375.888 220.052 362.425C229.222 353.713 238.607 345.1 247.464 336.07C255.775 327.6 269.92 314.205 274.395 303.31C276.567 298.015 276.535 292.188 274.865 286.763C269.93 270.71 251.065 252.97 242.008 238.139C235.247 227.069 230.534 213.584 230.428 200.532C230.308 185.685 235.376 171.709 243.827 159.633C252.502 147.236 268.04 134.95 279.502 124.732C304.695 102.44 330.067 80.3515 355.615 58.4685L381.287 36.3713C385.5 32.788 391.657 28.1733 395.285 24.3494Z" />
      <path d="M115.789 80.5143C120.453 76.99 132.054 71.151 137.713 67.9713C144.204 64.3238 152.736 59.1838 159.259 55.958C173.619 63.0673 187.05 70.5915 198.91 81.5568C199.368 82.0238 200.779 83.528 201.222 83.8283C217.109 101.321 221.089 119.892 220.064 143.261C219.443 157.415 219.496 171.372 219.497 185.538L219.48 339.58C218.001 342.205 205.738 353.535 202.86 356.362L159.287 399.092C158.728 391.647 158.998 381.6 159 373.945L159.002 332.385L158.983 200.995C158.967 192.022 159.081 183.049 159.324 174.079C159.744 155.919 160.893 133.991 154.866 116.75C149.452 101.263 130.572 87.1195 115.789 80.5143Z" />
    </svg>
  );
}

export function Tile({
  children,
  className = "",
  i = 0,
  style,
  pressable,
}: {
  children: ReactNode;
  className?: string;
  i?: number;
  style?: CSSProperties;
  pressable?: boolean;
}) {
  return (
    <BentoCard i={i} className={className} style={style} pressable={pressable}>
      {children}
    </BentoCard>
  );
}

/** Glass chip — reference "Shipped" pill (36px tall, 14px text). */
export function StatusPill({
  label,
  tone = "green",
  dark = false,
  followTheme = false,
}: {
  label: string;
  tone?: "green" | "blue" | "amber";
  dark?: boolean;
  /** true when the chip sits on a surface that itself changes with the theme */
  followTheme?: boolean;
}) {
  const dot = { green: "bg-green-500", blue: "bg-[#4f7cff]", amber: "bg-amber-400" }[tone];
  const surface = dark ? "glass-dark" : followTheme ? "" : "glass-light";
  return (
    <span className={`glass glass-chip ${surface}`}>
      <span className="glass-shadow" />
      <span className="glass-surface">
        <span className="glass-content h-9 gap-1.5 px-5 text-[14px] tracking-wide">
          <span className={`live-dot size-2 rounded-full ${dot}`} />
          {label}
        </span>
      </span>
    </span>
  );
}

type GlassButtonProps = {
  children: ReactNode;
  href?: string;
  download?: boolean;
  external?: boolean;
  onClick?: () => void;
  label?: string;
  /** "md" = 48px text button, "icon" = 40px round icon button */
  size?: "md" | "sm" | "icon";
  dark?: boolean;
  green?: boolean;
  className?: string;
};

/** Glass button — reference "Copy email" (48px tall, 16px medium). */
export function GlassButton({ children, href, download, external, onClick, label, size = "md", dark, green, className = "" }: GlassButtonProps) {
  const sizing = { icon: "size-10", sm: "h-10 gap-2 px-5 text-[15px]", md: "h-12 gap-3 px-6 text-[16px]" }[size];
  const content = <span className={`glass-content font-medium ${sizing}`}>{children}</span>;
  return (
    <span className={`glass glass-btn ${dark ? "glass-dark" : ""} ${green ? "glass-green" : ""} ${className}`}>
      <span className="glass-shadow" />
      {href ? (
        <a
          href={href}
          download={download || undefined}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          aria-label={label}
          className="glass-surface"
        >
          {content}
        </a>
      ) : (
        <button type="button" onClick={onClick} aria-label={label} className="glass-surface">
          {content}
        </button>
      )}
    </span>
  );
}

export function Letters({ text }: { text: string }) {
  return (
    <span className="letters" aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} aria-hidden style={{ ["--l" as string]: i }}>
          {c}
        </span>
      ))}
    </span>
  );
}

export const Icon = {
  mail: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="currentColor"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4.4 7H19.6L12 12.2Zm0 2.3L4 9v8h16V9l-8 5.5Z" /></svg>
  ),
  check: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
  ),
  download: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
  ),
  arrow: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
  ),
  linkedin: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5c0-1.2-.02-2.73-1.66-2.73-1.67 0-1.93 1.3-1.93 2.64V21h-4V9.75Z" /></svg>
  ),
  instagram: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>
  ),
  sun: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="currentColor"><circle cx="12" cy="12" r="4.2" /><g stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></g></svg>
  ),
  moon: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="currentColor"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" /></svg>
  ),
  plane: (p: { className?: string; style?: CSSProperties }) => (
    <svg viewBox="0 0 24 24" className={p.className} style={p.style} fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" /></svg>
  ),
  briefcase: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="currentColor"><path d="M9 3h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v4.5a2 2 0 0 1-1.3 1.9L13 17.3a3 3 0 0 1-2 0L3.3 14.4A2 2 0 0 1 2 12.5V8a2 2 0 0 1 2-2h3V5a2 2 0 0 1 2-2Zm0 3h6V5H9v1Zm-7 9.6 8.3 3.1a5 5 0 0 0 3.4 0l8.3-3.1V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3.4Z" /></svg>
  ),
  sparkle: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="currentColor"><path d="M12 2c.4 4.9 2.6 7.6 8 8-5.4.4-7.6 3.1-8 8-.4-4.9-2.6-7.6-8-8 5.4-.4 7.6-3.1 8-8Zm7 12c.2 2.2 1 3.3 3 3.5-2 .2-2.8 1.3-3 3.5-.2-2.2-1-3.3-3-3.5 2-.2 2.8-1.3 3-3.5Z" /></svg>
  ),
  close: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
  ),
};
