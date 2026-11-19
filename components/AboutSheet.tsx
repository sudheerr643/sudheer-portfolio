"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GlassButton, Icon } from "./ui";
import { experience, formatDuration, formatRange, profile, skills, tools } from "@/lib/content";

const HASHES = ["#about", "#experience"];

/** Slide-over panel with the full "about" story. Opens on #about / #experience. */
export function AboutSheet() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sync = () => {
      const h = window.location.hash;
      const isOpen = HASHES.includes(h);
      setOpen(isOpen);
      if (isOpen) {
        requestAnimationFrame(() => {
          if (h === "#experience" && expRef.current && panel.current) {
            panel.current.scrollTo({ top: expRef.current.offsetTop - 24, behavior: "smooth" });
          } else panel.current?.scrollTo({ top: 0 });
          panel.current?.focus();
        });
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const close = useCallback(() => {
    history.pushState(null, "", window.location.pathname);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={close} className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="About Sudheer"
        tabIndex={-1}
        className={`no-scrollbar absolute right-0 bottom-0 h-[92dvh] w-full overflow-y-auto rounded-t-[32px] bg-page outline-none transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] sm:top-3 sm:right-3 sm:bottom-3 sm:h-auto sm:w-[560px] sm:rounded-[32px] ${
          open ? "translate-x-0 translate-y-0" : "translate-y-full sm:translate-x-[110%] sm:translate-y-0"
        }`}
      >
        <div className="sticky top-0 z-10 flex justify-end p-4">
          <GlassButton size="icon" label="Close" onClick={close}>
            <Icon.close className="size-4" />
          </GlassButton>
        </div>

        <div className="-mt-14 space-y-3 px-3 pb-3 sm:px-4 sm:pb-4">
          {/* Intro */}
          <section className="tile p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="relative size-16 overflow-hidden rounded-full bg-chip">
                <Image src="/assets/profile.jpg" alt="" fill sizes="256px" className="origin-[73%_33%] scale-[2.4] object-cover object-[73%_33%]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Hey, I&apos;m {profile.name} 👋</h2>
                <p className="text-sm text-muted">{profile.role}</p>
              </div>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-ink/80">{profile.bio}</p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {profile.stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-chip px-3 py-3">
                  <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section ref={expRef} className="tile p-6 sm:p-8">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Experience</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">Where I&apos;ve worked</h3>
            <ol className="mt-6 space-y-7">
              {experience.map((r, idx) => (
                <li key={r.company} className="relative pl-6">
                  <span className={`absolute top-1.5 left-0 size-2.5 rounded-full ${idx === 0 ? "bg-green-500 live-dot" : "bg-muted/40"}`} />
                  {idx < experience.length - 1 && <span className="absolute top-5 bottom-[-22px] left-[4.5px] w-px bg-line" />}
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h4 className="font-semibold">{r.company}</h4>
                    <span className="text-[11px] font-medium tracking-wide text-muted">{formatRange(r.start, r.end)}</span>
                  </div>
                  <p className="text-sm text-muted">
                    {r.title} · {formatDuration(r.start, r.end).toLowerCase()}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">{r.summary}</p>
                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink/70">
                    {r.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-muted" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <span key={t} className="rounded-full bg-chip px-2.5 py-1 text-[11px] font-medium text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Stack */}
          <section className="tile p-6 sm:p-8">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">My stack</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">Tools I think in</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {tools.map((t) => (
                <span key={t} className="rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-page">
                  {t}
                </span>
              ))}
              {skills.map((t) => (
                <span key={t} className="rounded-full bg-chip px-3.5 py-1.5 text-sm font-medium">
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="tile bg-ink! p-6 text-page sm:p-8">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase opacity-60">Contact</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">Open to new design roles.</h3>
            <div className="mt-5 space-y-1 text-sm">
              <a href={`mailto:${profile.email}`} className="block underline-offset-4 hover:underline">
                {profile.email}
              </a>
              <a href={profile.phoneHref} className="block opacity-70 underline-offset-4 hover:underline">
                {profile.phone}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={`mailto:${profile.email}`} className="inline-flex h-11 items-center gap-2 rounded-full bg-page px-5 text-sm font-medium text-ink">
                Let&apos;s work together <Icon.arrow className="size-4" />
              </a>
              <a href={profile.resume} download className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium ring-1 ring-current/25">
                <Icon.download className="size-4" /> Resume
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
