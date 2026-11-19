import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Letters, StatusPill, Tile } from "./ui";
import { Phone } from "./splitpay/Phone";
import { Screen } from "./splitpay/screens";

type CardProps = {
  title: string;
  subtitle: string;
  status: string;
  tone?: "green" | "blue" | "amber";
  href?: string;
  external?: boolean;
  /** "light": media sits on a white card with the caption below (reference: Android Private Space).
   *  "dark": full-bleed media with the caption over it (reference: Pixel Satellite SOS). */
  variant?: "light" | "dark";
  className?: string;
  i?: number;
  media: ReactNode;
};

export function ProjectCard({ title, subtitle, status, tone = "green", href, external, variant = "light", className = "", i, media }: CardProps) {
  const dark = variant === "dark";
  const body = (
    <>
      <div
        className={`absolute inset-x-0 top-0 transition-transform duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03] ${
          dark ? "bottom-0" : "bottom-[96px]"
        }`}
      >
        {media}
      </div>
      {dark && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />}
      <div className="absolute top-6 right-6 z-10">
        <StatusPill label={status} tone={tone} dark={dark} followTheme={!href && !dark} />
      </div>
      <div className={`absolute inset-x-0 bottom-0 z-10 p-6 ${dark ? "text-white" : "text-ink"}`}>
        <h3 className="text-[20px] leading-[1.4] font-semibold tracking-[-0.02em] text-balance">
          <Letters text={title} />
        </h3>
        <p className={`text-[14px] leading-[1.45] ${dark ? "text-white/75" : "text-muted"}`}>{subtitle}</p>
      </div>
    </>
  );

  const cls = "group block h-full w-full";
  return (
    <Tile i={i} pressable={!!href} className={`!p-0 ${className} ${dark ? "!bg-[#161616]" : ""}`}>
      {href ? (
        external ? (
          <a href={href} target="_blank" rel="noreferrer" className={cls} aria-label={`${title} case study`} data-cursor-text="View project" data-cursor-tone={dark ? "dark" : "light"}>
            {body}
          </a>
        ) : (
          <Link href={href} className={cls} aria-label={`${title} case study`} data-cursor-text="View project" data-cursor-tone={dark ? "dark" : "light"}>
            {body}
          </Link>
        )
      ) : (
        <div className={cls}>{body}</div>
      )}
    </Tile>
  );
}

/* ---------- Media ---------- */

export function PayinstacardMedia() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
    <video
      className="h-full w-full origin-[97%_50%] scale-[1.25] object-cover object-right"
      src="/assets/payinstacard-thumb.mp4"
      poster="/assets/payinstacard-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
    {/* hides the thumbnail's own title text on the left */}
    <div className="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-black from-45% to-transparent" />
    </div>
  );
}

export function EjoyMedia() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src="/assets/ejoy-thumb.png"
        alt="Ejoy Shop app screens"
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="origin-[100%_42%] scale-[1.5] object-cover object-right"
      />
    </div>
  );
}

/** Split Pay concept: two phones on a soft brand gradient. */
export function SplitPayMedia() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#FFE3E8_0%,#FFF5F6_45%,#FFFFFF_100%)]">
      <div className="absolute inset-0 flex items-center justify-center gap-5 pt-4">
        <div className="mt-16 -rotate-[4deg]">
          <Phone width={176}>
            <Screen id="f1-invite" />
          </Phone>
        </div>
        <div className="rotate-[3deg]">
          <Phone width={200}>
            <Screen id="s3-status" />
          </Phone>
        </div>
      </div>
    </div>
  );
}

/** In-progress tile: oversized type, echoing the reference's "Welcome!" card. */
export function WritingMedia() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-card from-40% to-chip">
      <div className="absolute inset-x-[12%] top-[14%] bottom-[22%] rounded-[28px] border border-line bg-card shadow-[0_30px_60px_-30px_rgba(0,0,0,.35)]">
        <div className="space-y-2.5 p-[8%]">
          <div className="h-2.5 w-1/3 rounded-full bg-chip" />
          <div className="h-2.5 w-4/5 rounded-full bg-chip" />
          <div className="h-2.5 w-3/5 rounded-full bg-chip" />
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="aspect-[3/4] rounded-xl bg-chip" />
            <div className="aspect-[3/4] rounded-xl bg-chip" />
            <div className="aspect-[3/4] rounded-xl bg-chip" />
          </div>
        </div>
      </div>
      <p className="relative mt-[18%] text-[clamp(64px,8.2vw,150px)] leading-none font-bold tracking-[-0.06em] text-ink">
        Soon<span className="animate-pulse text-orange">.</span>
      </p>
    </div>
  );
}
