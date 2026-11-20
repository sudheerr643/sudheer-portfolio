import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { GlassButton, Icon, Logo } from "@/components/ui";
import { CopyEmail, ThemeToggle } from "@/components/widgets";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Payinstacard: Rental Payments Experience Revamp · Sudheer",
  description:
    "Redesigning Payinstacard's end-to-end mobile rent payment flow into a guided, high-trust transaction journey, cutting desktop dependency from 70% to 45%.",
};

function Card({ children, className = "", dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return <div className={`tile p-6 sm:p-8 ${dark ? "!bg-[#0b0b0b] text-white" : ""} ${className}`}>{children}</div>;
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`text-[11px] font-semibold tracking-[0.14em] uppercase ${light ? "text-white/50" : "text-muted"}`}>{children}</p>;
}

function Figure({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return (
    <div className="tile overflow-hidden !bg-white p-2 sm:p-3">
      <Image src={src} alt={alt} width={w} height={h} sizes="(min-width: 1100px) 1080px, 100vw" className="h-auto w-full rounded-[20px]" />
    </div>
  );
}

function Story({ n, title, quote }: { n: string; title: string; quote: string }) {
  return (
    <div className="grid gap-4 px-1 pt-10 pb-2 sm:grid-cols-[120px_1fr]">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">Story {n}</p>
      <div>
        <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] leading-tight font-semibold tracking-[-0.03em]">{title}</h2>
        <p className="mt-2 text-lg text-muted">“{quote}”</p>
      </div>
    </div>
  );
}

export default function Payinstacard() {
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-4 sm:px-6 sm:py-6">
      {/* Top bar */}
      <nav className="tile rise sticky top-3 z-20 flex items-center justify-between !rounded-full py-2 pr-2 pl-5">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium" aria-label="Back to home">
          <Logo className="h-6 w-auto" />
          <span className="hidden text-muted sm:inline">← All work</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CopyEmail />
          </div>
          <GlassButton href={profile.resume} download>
            <Icon.download className="size-4" /> Resume
          </GlassButton>
        </div>
      </nav>

      <div className="mt-4 space-y-4">
        {/* Hero */}
        <section className="tile rise relative overflow-hidden !bg-[#0b0b0b] text-white" style={{ ["--i" as string]: 1 }}>
          <div className="grid items-stretch md:grid-cols-[1.1fr_1fr]">
            <div className="relative z-10 p-7 sm:p-10">
              <div className="flex flex-wrap gap-1.5">
                {["UX Research", "Product Design", "FinTech", "Mobile App"].map((t) => (
                  <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80 ring-1 ring-white/10">
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
                Rental Payments
                <br />
                <span className="text-white/55">Experience Revamp</span>
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
                Redesigned the end-to-end mobile experience to transform a fragmented payment flow into a guided, high-trust transaction journey.
              </p>
              <div className="mt-8 flex items-end gap-4">
                <p className="text-[clamp(2.4rem,5vw,3.4rem)] leading-none font-semibold tracking-tight">
                  <span className="text-white/40 line-through decoration-2">70%</span>
                  <span className="mx-2 text-white/40">→</span>
                  <span className="bg-gradient-to-r from-[#ff8a3d] to-[#ff2e7e] bg-clip-text text-transparent">45%</span>
                </p>
              </div>
              <p className="mt-2 text-sm text-white/60">desktop dependency</p>
            </div>
            {/* media stays inside its own column and never overlaps the text */}
            <div className="relative h-[360px] overflow-hidden md:h-auto md:min-h-[520px]">
              {/* cropped to just the phones, so no banner lettering can show at any width */}
              <video
                className="absolute inset-0 h-full w-full object-cover object-center"
                src="/assets/payinstacard-phones.mp4"
                poster="/assets/payinstacard-phones-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
              />
              {/* soft blend into the card on the left */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[12%] bg-gradient-to-r from-[#0b0b0b] to-transparent" />
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {["45% less desktop dependency", "Improved flow completion", "Reduced drop-offs", "Increased user confidence"].map((o, i) => (
            <div key={o} className="tile rise flex min-h-[120px] items-end p-5 text-[15px] leading-snug font-semibold tracking-tight" style={{ ["--i" as string]: i + 2 }}>
              <span>
                <span className="mb-3 block size-2 rounded-full bg-green-500" />
                {o}
              </span>
            </div>
          ))}
        </section>

        {/* Context */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <Eyebrow>Context</Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">What is Payinstacard?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A digital payments platform that enables users to pay rent, utilities, credit cards, and more, all in one accessible place.
            </p>
          </Card>
          <Card>
            <Eyebrow>Mission</Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">Why it exists</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">To make everyday and high-value recurring payments simple, fast, and entirely reliable.</p>
          </Card>
          <Card>
            <Eyebrow>User needs</Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">What users expect</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              {["Quick and predictable flows", "Clear transaction details", "High trust for large payments"].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <Icon.check className="size-3.5 text-green-600" />
                  {x}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Problem */}
        <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Card>
            <Eyebrow>Problem statement</Eyebrow>
            <p className="mt-3 text-[clamp(1.3rem,2.4vw,1.75rem)] leading-snug font-semibold tracking-tight">
              A significant number of users were not completing transactions on mobile, despite high intent to pay.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Users were switching to desktop or abandoning flows midway, not due to a lack of features, but due to friction in the experience. The
              flow introduced friction in moments where users needed clarity, confidence, and control.
            </p>
          </Card>
          <Card className="flex flex-col justify-between">
            <div className="space-y-4">
              {[
                ["User intent", "High", "w-[92%] bg-green-500"],
                ["Task completion", "Low", "w-[30%] bg-red-500"],
              ].map(([l, v, bar]) => (
                <div key={l}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{l}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-chip">
                    <div className={`h-full rounded-full ${bar}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              {["Clarity", "Confidence", "Control"].map((c, i) => (
                <span key={c} className="flex-1 rounded-2xl bg-chip px-3 py-3 text-center text-xs font-semibold">
                  <span className="block text-lg text-accent">{i + 1}</span>
                  {c}
                </span>
              ))}
            </div>
          </Card>
        </section>

        <Card dark className="text-center">
          <Eyebrow light>How might we</Eyebrow>
          <p className="mx-auto mt-3 max-w-3xl text-[clamp(1.4rem,3vw,2.2rem)] leading-tight font-semibold tracking-[-0.025em]">
            How might we redesign the payment experience to make high-value transactions feel simple, predictable, and trustworthy?
          </p>
        </Card>

        {/* Transformation */}
        <section className="grid gap-4 md:grid-cols-[1fr_minmax(0,340px)]">
          <div className="grid gap-4">
          <Card className="flex flex-col justify-center">
            <Eyebrow>Before</Eyebrow>
            <ul className="mt-3 space-y-2 text-[15px] text-muted">
              <li>Fragmented, form-heavy flow.</li>
              <li>Multiple steps with repeated inputs.</li>
              <li>Low clarity around payments.</li>
            </ul>
          </Card>
          <Card className="flex flex-col justify-center">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-green-600 uppercase">After</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li>Guided, linear experience.</li>
              <li>Reduced steps and effort.</li>
              <li>Clear and transparent payment flow.</li>
            </ul>
            <p className="mt-6 text-sm font-semibold text-accent">From friction → clarity</p>
          </Card>
          </div>
          {/* portrait recording (1080×1920): card matches 9:16 so nothing is cropped */}
          <div className="tile relative mx-auto aspect-[9/16] w-full max-w-[420px] self-start overflow-hidden !bg-[#0b0b0b]">
            <video className="absolute inset-0 h-full w-full object-contain" src="/assets/payinstacard/redesign-overview.mp4" autoPlay muted loop playsInline preload="metadata" />
          </div>
        </section>

        <Story n="01" title="Simplifying entry into the flow" quote="Users don't think in steps. They think in goals." />
        <Figure src="/assets/payinstacard/story-1.png" alt="Story 01: simplifying entry into the flow" w={11140} h={4977} />
        <p className="px-1 pt-6 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Evolution of the design · Iterations & refinement</p>
        <Figure src="/assets/payinstacard/payment-iterations.png" alt="Payment flow iterations" w={6440} h={4952} />

        <Story n="02" title="Reducing effort & improving clarity" quote="Users don't want repetition or surprises when money is involved." />
        <Figure src="/assets/payinstacard/story-2.png" alt="Story 02: reducing effort and improving clarity" w={10800} h={4684} />

        <Story n="03" title="Enhancing the post-payment experience" quote="After completing a payment, users want closure, not more decisions." />
        <Figure src="/assets/payinstacard/story-3.png" alt="Story 03: enhancing the post-payment experience" w={10800} h={4684} />
        <p className="px-1 pt-6 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Evolution of the design · Success flow iterations</p>
        <Figure src="/assets/payinstacard/success-iterations.png" alt="Success screen iterations" w={6440} h={4952} />

        {/* Testing */}
        <div className="px-1 pt-10">
          <Eyebrow>Validating the experience</Eyebrow>
          <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold tracking-[-0.03em]">User testing</h2>
          <p className="mt-2 max-w-xl text-muted">Tested the redesigned flow with real users performing rental payment tasks.</p>
        </div>
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["What we saw", ["Users hesitated before confirming payments", "Confusion around total payable amount", "Lack of confidence before final step"], "bg-amber-400"],
            ["What changed", ["Introduced Review & Pay step", "Made total amount visible upfront", "Reduced unnecessary steps"], "bg-accent"],
            ["Impact", ["Faster completion of payment flow", "Reduced drop-offs before payment", "Increased user confidence"], "bg-green-500"],
          ].map(([h, items, dot]) => (
            <Card key={h as string}>
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${dot}`} />
                <Eyebrow>{h as string}</Eyebrow>
              </div>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                {(items as string[]).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </Card>
          ))}
        </section>
        <Card className="!bg-accent-soft">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">Key learning</p>
          <p className="mt-2 text-xl font-semibold tracking-tight">Small structural changes in the flow had a bigger impact than adding new features.</p>
        </Card>

        {/* Reflections */}
        <div className="px-1 pt-10">
          <Eyebrow>Reflections & learnings</Eyebrow>
          <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold tracking-[-0.03em]">Key takeaways</h2>
        </div>
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Clarity > complexity", "Users don't need more options. They need fewer, clearer ones. Removing ambiguity was the single most effective change."],
            ["Reduce steps, not add features", "Every step removed was more impactful than any feature added. Simplification beat functionality every time."],
            ["Trust comes from transparency", "Showing the total upfront and confirming details before payment built the confidence users needed to complete transactions."],
          ].map(([h, p], i) => (
            <Card key={h}>
              <span className="text-sm font-semibold text-accent tabular-nums">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p}</p>
            </Card>
          ))}
        </section>

        <Card dark className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xl font-semibold tracking-tight">Solving friction in the right moments is more impactful than adding new features.</p>
          <Link href="/" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black">
            More work <Icon.arrow className="size-4" />
          </Link>
        </Card>

        <div className="tile relative h-[96px] overflow-hidden">
          <ThemeToggle />
        </div>
        <p className="py-6 text-center text-xs text-muted">© {new Date().getFullYear()} {profile.fullName}.</p>
      </div>
    </main>
  );
}
