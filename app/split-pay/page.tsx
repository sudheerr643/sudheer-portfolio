import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Phone } from "@/components/splitpay/Phone";
import { Prototype } from "@/components/splitpay/Prototype";
import { Screen } from "@/components/splitpay/screens";
import { screenMeta as screens, type ScreenId } from "@/lib/splitpay/screenMeta";
import { GlassButton, Icon, Logo } from "@/components/ui";
import { CopyEmail, ThemeToggle } from "@/components/widgets";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Split Pay — group movie bookings · Sudheer",
  description:
    "A product design concept: let a group lock seats together and each friend pay for their own seat from a link — no chasing money afterwards. Unofficial concept for BookMyShow.",
};

/* ---------- small building blocks ---------- */
function Card({ children, className = "", dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return <div className={`tile p-6 sm:p-8 ${dark ? "!bg-[#0b0b0b] text-white" : ""} ${className}`}>{children}</div>;
}
function Eyebrow({ children, light = false, className = "" }: { children: ReactNode; light?: boolean; className?: string }) {
  return <p className={`text-[11px] font-semibold tracking-[0.14em] uppercase ${light ? "text-white/50" : "text-muted"} ${className}`}>{children}</p>;
}
function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.3rem)] leading-tight font-semibold tracking-[-0.03em]">{children}</h2>;
}
function Section({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <section className="space-y-4 pt-10">
      <div className="px-1">
        <Eyebrow>{eyebrow}</Eyebrow>
        <H2>{title}</H2>
        {intro && <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-muted">{intro}</p>}
      </div>
      {children}
    </section>
  );
}
function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-muted underline decoration-line underline-offset-4 hover:text-ink">
      {children}
      <Icon.arrow className="size-3" />
    </a>
  );
}

/* ---------- desk research (sources checked Nov 2026) ---------- */
const stats = [
  {
    value: "75%",
    label: "of metro moviegoers aged 18–44 watch with family and friends",
    context: "GroupM's “Profiling Cinemagoers” study of 1,075 adults across five metros. Going to the movies is overwhelmingly a group plan.",
    source: "GroupM India via BestMediaInfo",
    href: "https://bestmediainfo.com/insights/groupm-india-unveils-profiling-cinemagoers-report-on-cinema-viewing-habits-of-consumers-8736512",
  },
  {
    value: "21.6 bn",
    label: "UPI payments in a single month (December 2025)",
    context: "A record month on NPCI data. Paying a friend's share instantly is now a habit, not a hurdle — the rail Split Pay is built on.",
    source: "NPCI data via Entrackr",
    href: "https://entrackr.com/news/upi-records-highest-ever-monthly-transactions-at-2163-bn-in-december-10963201",
  },
  {
    value: "1 in 5",
    label: "adults have paid more than their share because splitting felt awkward",
    context: "A 2,000-person UK study (21%). Money between friends is socially loaded — the product should make asking unnecessary, not just easier.",
    source: "Global Banking & Finance Review",
    href: "https://www.globalbankingandfinance.com/we-lose-an-average-of-2-6-billion-per-year-lending-money-to-friends-and-colleagues/",
  },
];

const competitors = [
  {
    name: "PhonePe Split Expense",
    href: "https://cms.phonepe.com/en/myhelp/money-transfers/spilt-expense/what-split-expense-phonepe",
    how: "Split a payment with contacts or a group after it's made; friends settle in-app, or you manually mark them as settled if they paid outside.",
    lesson: "Splitting after the fact still leaves one person fronting the money and reconciling by hand.",
  },
  {
    name: "Paytm Split Bills",
    href: "https://paytm.com/blog/payments/movie-nights-trips-more-split-bills-using-paytm/",
    how: "Track and split shared expenses equally or by custom amounts — Paytm even lists movie nights as a use case.",
    lesson: "Demand for splitting movie costs is real, but it happens outside the booking, with no link to seats.",
  },
  {
    name: "Airbnb split payments (2017)",
    href: "https://techcrunch.com/2017/11/28/airbnb-launches-payment-splitting-for-group-trips/",
    how: "Organiser paid only their share; others had 72 hours to pay. Every guest needed the app and an account. Later withdrawn.",
    lesson: "The right model, but too much friction: a long window and a forced install. Split Pay uses a short hold and a no-app web link.",
  },
];

const insights = [
  {
    title: "The group decides together, but one person pays",
    text: "Most moviegoers go with family or friends, yet checkout is built for one card. That mismatch is where the friction lives.",
    design: "Offer split at seat selection (Decision 01)",
  },
  {
    title: "Splitting after payment doesn't remove the risk",
    text: "Payment apps help track who owes what, but the organiser still fronts the full amount and chases it down.",
    design: "Organiser pays only their own seat (Decision 02)",
  },
  {
    title: "Every extra step costs a friend",
    text: "Airbnb's version required every guest to install the app and gave them days to pay. Long windows and installs stall plans.",
    design: "10-minute hold + pay from a web link (Decision 03)",
  },
];
function Shot({ id, width = 260, caption = true }: { id: ScreenId; width?: number; caption?: boolean }) {
  return (
    <figure className="flex flex-col items-center">
      <Phone width={width}>
        <Screen id={id} />
      </Phone>
      {caption && (
        <figcaption className="mt-4 max-w-[280px] text-center">
          <span className="block text-[14px] font-semibold">{screens[id].title}</span>
          <span className="mt-0.5 block text-[13px] leading-snug text-muted">{screens[id].note}</span>
        </figcaption>
      )}
    </figure>
  );
}

function Decision({ n, title, chose, why, alt, shots }: { n: string; title: string; chose: string; why: string; alt: string[]; shots: ScreenId[] }) {
  return (
    <div className="tile p-6 sm:p-10">
      {/* text on top */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
        <div>
          <span className="text-sm font-semibold text-accent tabular-nums">Decision {n}</span>
          <h3 className="mt-2 text-[clamp(22px,2.4vw,28px)] leading-tight font-semibold tracking-[-0.02em]">{title}</h3>
          <p className="mt-4 text-[15px] leading-relaxed"><b>What I chose: </b>{chose}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted"><b className="text-ink">Why: </b>{why}</p>
        </div>
        <div className="self-start rounded-2xl bg-chip p-5">
          <p className="text-[12px] font-semibold tracking-[0.1em] text-muted uppercase">Options I ruled out</p>
          <ul className="mt-3 space-y-2 text-[14px] leading-snug text-muted">
            {alt.map((a) => (
              <li key={a} className="flex gap-2"><span className="mt-[7px] size-1 shrink-0 rounded-full bg-muted" />{a}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* screens below */}
      <div className="mt-10 flex flex-wrap items-start justify-center gap-x-10 gap-y-8 border-t border-line pt-10">
        {shots.map((s) => <Shot key={s} id={s} width={250} />)}
      </div>
    </div>
  );
}

function FlowStep({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "brand" | "ok" }) {
  const cls = tone === "brand" ? "bg-[#F84464] text-white" : tone === "ok" ? "bg-[#0E9F6E] text-white" : "bg-chip";
  return <span className={`rounded-xl px-3 py-2 text-[13px] font-medium whitespace-nowrap ${cls}`}>{children}</span>;
}
const Arrow = () => <span className="text-muted" aria-hidden>→</span>;

/* ================================================================ page */
export default function SplitPayCaseStudy() {
  return (
    <main className="mx-auto max-w-[1180px] px-4 py-4 sm:px-6 sm:py-6">
      <nav className="tile sticky top-3 z-20 flex items-center justify-between !rounded-full py-2 pr-2 pl-5">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium" aria-label="Back to home">
          <Logo className="h-6 w-auto" />
          <span className="hidden text-muted sm:inline">← All work</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><CopyEmail /></div>
          <GlassButton href={profile.resume} download><Icon.download className="size-4" /> Resume</GlassButton>
        </div>
      </nav>

      <div className="mt-4 space-y-4">
        {/* ---------------- Hero ---------------- */}
        <section className="tile overflow-hidden">
          <div className="grid items-center gap-6 p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <div className="flex flex-wrap gap-1.5">
                {["Product Design", "Feature concept", "Payments", "Mobile + Web"].map((t) => (
                  <span key={t} className="rounded-full bg-chip px-2.5 py-1 text-[12px] font-medium text-muted">{t}</span>
                ))}
              </div>
              <h1 className="mt-6 text-[clamp(2.3rem,4.6vw,3.6rem)] leading-[1.04] font-semibold tracking-[-0.04em]">
                Split Pay
                <br />
                <span className="text-muted">Book together. Pay separately.</span>
              </h1>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted">
                A feature concept for a movie-ticketing app: the group locks seats together and every friend pays for their own seat from a link — so nobody fronts the full amount or chases money afterwards.
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-chip px-3 py-1.5 text-[12px] text-muted">
                <span className="size-1.5 rounded-full bg-[#F84464]" /> Unofficial concept for BookMyShow · not affiliated
              </p>
            </div>
            <div className="flex items-end justify-center gap-3 sm:gap-5">
              <div className="hidden translate-y-6 sm:block"><Phone width={190}><Screen id="s2-split" /></Phone></div>
              <Phone width={230}><Screen id="s3-status" /></Phone>
              <div className="hidden translate-y-6 sm:block"><Phone width={190}><Screen id="f1-invite" /></Phone></div>
            </div>
          </div>
        </section>

        {/* ---------------- Overview ---------------- */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["Role", "Solo — research, UX, UI, prototype"],
            ["Timeline", "3 weeks (self-initiated)"],
            ["Platform", "iOS / Android app + mobile web"],
            ["Tools", "Figma, ProtoPie, code prototype"],
          ].map(([k, v]) => (
            <div key={k} className="tile p-5">
              <Eyebrow>{k}</Eyebrow>
              <p className="mt-2 text-[15px] leading-snug font-medium">{v}</p>
            </div>
          ))}
        </section>

        {/* ---------------- Problem ---------------- */}
        <Section eyebrow="The problem" title="One friend pays for everyone — then becomes the collections department">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <Card>
              <p className="text-[clamp(1.2rem,2.2vw,1.55rem)] leading-snug font-semibold tracking-tight">
                Movie tickets are a group decision, but checkout is built for one payer.
              </p>
              <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted">
                <li><b className="text-ink">The organiser carries the risk.</b> For six seats that&apos;s ₹2,100 up front, recovered over days through UPI requests and reminders.</li>
                <li><b className="text-ink">Plans stay loose.</b> Friends have no stake until they&apos;ve paid, so “I&apos;m in” can quietly become “something came up”.</li>
                <li><b className="text-ink">Waiting costs seats.</b> Organisers hold off booking until everyone confirms — and lose the good seats while they wait.</li>
              </ul>
            </Card>
            <div className="flex justify-center"><Shot id="c0-today" width={250} /></div>
          </div>
        </Section>

        {/* ---------------- Research ---------------- */}
        <Section
          eyebrow="Research"
          title="What the evidence says"
          intro="Desk research: published industry surveys, payments data, and how BookMyShow and other products have handled group payments before. Every number links to its source."
        >
          {/* Key stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((s) => (
              <Card key={s.value + s.label} className="flex flex-col">
                <p className="text-[clamp(2.4rem,4vw,3.2rem)] leading-none font-semibold tracking-[-0.04em]">{s.value}</p>
                <p className="mt-3 text-[15px] leading-snug font-medium">{s.label}</p>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">{s.context}</p>
                <SourceLink href={s.href}>{s.source}</SourceLink>
              </Card>
            ))}
          </div>

          {/* The BookMyShow history insight */}
          <Card>
            <div>
              <Eyebrow className="!text-[#F84464]">The key insight</Eyebrow>
              <p className="mt-3 text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug font-semibold tracking-tight">
                BookMyShow has tried group payments before. The payment rails just weren&apos;t ready.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Around 2016 BookMyShow shipped <b className="text-ink">Split Tickets</b>: the booking cost was shared across the group and each friend paid their part through BookMyShow&apos;s own wallet. In 2017 it added <b className="text-ink">Plan It</b>, a group-planning chat it said came from user requests. Then in early 2018 BookMyShow shut its wallet after RBI tightened rules for prepaid wallets — taking away the payment route Split Tickets depended on. I couldn&apos;t find any UPI-based replacement since.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed">
                <b>Why now:</b> the demand was proven in 2016–17. What was missing was a way for anyone to pay instantly without a closed wallet — which is exactly what UPI now is.
              </p>
              <p className="mt-2 flex flex-wrap items-baseline gap-x-4 text-[12px] text-muted">
                <span>Sources:</span>
                <SourceLink href="https://www.fonearena.com/blog/206341/bookmyshow-update-adds-split-tickets-mini-maps-new-language-support-and-more.html">Fonearena</SourceLink>
                <SourceLink href="https://yourstory.com/2017/06/bookmyshow-plan-it/">YourStory</SourceLink>
                <SourceLink href="https://entrackr.com/2018/01/bookmyshow-shuts-wallet/">Entrackr</SourceLink>
              </p>
            </div>
          </Card>

          {/* Competitive scan */}
          <div className="tile overflow-x-auto p-6 sm:p-8">
            <Eyebrow>How others handle group payments</Eyebrow>
            <table className="mt-4 w-full min-w-[640px] text-left text-[14px]">
              <thead className="text-[12px] tracking-[0.08em] text-muted uppercase">
                <tr>
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">How it works</th>
                  <th className="pb-3 font-semibold">What I took from it</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line align-top">
                {competitors.map((c) => (
                  <tr key={c.name}>
                    <td className="py-3.5 pr-4 font-semibold whitespace-nowrap">
                      {c.name}
                      <span className="block"><SourceLink href={c.href}>source</SourceLink></span>
                    </td>
                    <td className="py-3.5 pr-4 text-muted">{c.how}</td>
                    <td className="py-3.5">{c.lesson}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Synthesis */}
          <div className="grid gap-4 md:grid-cols-3">
            {insights.map((x, i) => (
              <Card key={x.title}>
                <span className="text-sm font-semibold text-accent tabular-nums">Insight 0{i + 1}</span>
                <h3 className="mt-3 text-lg leading-snug font-semibold tracking-tight">{x.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{x.text}</p>
                <p className="mt-3 text-[13px] font-medium text-[#F84464]">→ {x.design}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Card dark className="text-center">
          <Eyebrow light>How might we</Eyebrow>
          <p className="mx-auto mt-3 max-w-3xl text-[clamp(1.4rem,3vw,2.2rem)] leading-tight font-semibold tracking-[-0.025em]">
            How might we let a group lock seats together and each pay for their own — without making booking slower for the person organising?
          </p>
        </Card>

        {/* ---------------- Business case ---------------- */}
        <Section eyebrow="Why the business would build it" title="Group bookings are bigger baskets — and the riskiest checkouts">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Group conversion", "Fewer abandoned 4–8 seat selections when the organiser only pays for one seat."],
              ["Tickets per transaction", "Groups book together instead of in fragments, so average order size grows."],
              ["New users from links", "Every invite is a mobile-web checkout for someone who may not have the app yet."],
              ["Fewer support tickets", "Clear rules for no-shows and refunds replace messy manual cancellations."],
            ].map(([t, d], i) => (
              <Card key={t}>
                <span className="text-sm font-semibold text-accent tabular-nums">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ---------------- Principles ---------------- */}
        <Section eyebrow="Design principles" title="Three rules every screen had to follow">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Lock seats, not people", "Seats are guaranteed the moment the organiser commits — the group can't lose them while friends pay."],
              ["Nobody waits on the slowest friend", "A visible hold timer and a recommended fallback mean the booking always resolves, on time."],
              ["Money is never ambiguous", "Everyone always knows who paid, what they paid, and what happens to their money if plans change."],
            ].map(([t, d]) => (
              <Card key={t}>
                <h3 className="text-lg font-semibold tracking-tight">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ---------------- Flow ---------------- */}
        <Section eyebrow="User flow" title="Two people, one booking">
          <Card className="space-y-6 overflow-x-auto">
            <div>
              <p className="mb-3 text-[13px] font-semibold">Organiser</p>
              <div className="flex items-center gap-2">
                <FlowStep>Pick 6 seats</FlowStep><Arrow />
                <FlowStep tone="brand">Split with friends</FlowStep><Arrow />
                <FlowStep>Pay own seat · seats held 10 min</FlowStep><Arrow />
                <FlowStep>Share invite link</FlowStep><Arrow />
                <FlowStep>Watch live status</FlowStep><Arrow />
                <FlowStep tone="ok">All paid → booked</FlowStep>
              </div>
            </div>
            <div>
              <p className="mb-3 text-[13px] font-semibold">Friend</p>
              <div className="flex items-center gap-2">
                <FlowStep>Open link (no app)</FlowStep><Arrow />
                <FlowStep>See seat + share</FlowStep><Arrow />
                <FlowStep tone="brand">Pay with UPI</FlowStep><Arrow />
                <FlowStep tone="ok">Own M-ticket</FlowStep>
              </div>
            </div>
            <div>
              <p className="mb-3 text-[13px] font-semibold">When things go wrong</p>
              <div className="flex flex-wrap items-center gap-2">
                <FlowStep>Hold ending → extend once / cover / release</FlowStep>
                <FlowStep>Payment failed → seat stays held, retry</FlowStep>
                <FlowStep>Friend drops out → seat back to organiser</FlowStep>
              </div>
            </div>
          </Card>
        </Section>

        {/* ---------------- Decisions ---------------- */}
        <Section eyebrow="Key decisions" title="Where the design could have gone wrong">
          <div className="space-y-4">
            <Decision
              n="01"
              title="Offer split at seat selection, not after payment"
              chose="A “Split with friends” entry right under the seat map, alongside the normal pay button."
              why="The group decision happens while picking seats. Offering split there means the organiser never fronts the money — after payment, it's just a reminder tool."
              alt={["A “Share cost” button on the confirmation screen — too late, the organiser has already paid.", "A separate “Group booking” tab — hidden, and splits the booking journey in two."]}
              shots={["s1-seats"]}
            />
            <Decision
              n="02"
              title="The organiser pays only their own seat — the rest are held for 10 minutes"
              chose="Pay one share, lock every seat for the group, and show a hold timer to everyone."
              why="It removes the financial risk without risking the seats. Ten minutes is long enough to pay from a chat link but short enough to keep inventory moving — and it's the first thing I'd A/B test in a pilot."
              alt={["Organiser pays everything, friends reimburse in-app — keeps the risk on the organiser.", "No hold, everyone books individually — groups end up scattered across rows."]}
              shots={["s2-split", "s3-status"]}
            />
            <Decision
              n="03"
              title="Friends pay from a web link — no app, no account"
              chose="The invite opens in the browser: who invited you, your seat, your share, time left, and one UPI button."
              why="Forcing an install at the moment of payment is the biggest drop-off risk. The ticket screen suggests the app afterwards, when it's useful (the M-ticket)."
              alt={["Require the app to pay — adds install and sign-up before a ₹350 payment.", "Pay by UPI request from the organiser — no seat context, and nothing tells the app who paid."]}
              shots={["f1-invite", "f2-upi", "f3-ticket"]}
            />
          </div>
        </Section>

        {/* ---------------- Edge cases ---------------- */}
        <Section eyebrow="Edge cases" title="Designing for when plans fall apart" intro="Group plans change constantly. Each failure has a clear owner, a recommended default, and an explicit money outcome.">
          <div className="tile grid gap-x-8 gap-y-14 p-6 sm:grid-cols-2 sm:p-10 lg:grid-cols-3">
            {(["e1-expiring", "e2-expired", "e3-failed", "e4-dropout", "e5-pending", "e6-offer", "e7-late-link", "e8-show-soon", "e9-edit-group"] as ScreenId[]).map((id) => <Shot key={id} id={id} width={250} />)}
          </div>
        </Section>

        {/* ---------------- Prototype ---------------- */}
        <Section eyebrow="Prototype" title="Try it" intro="Tap through the organiser and friend flows. On the live status screen, friends pay in real time and the booking confirms itself.">
          <div className="tile p-6 sm:p-10">
            <Prototype />
          </div>
        </Section>

        {/* ---------------- Reflection ---------------- */}
        <Section eyebrow="Reflection" title="What I'd do next">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Pilot with a hold-length experiment", "A/B test 7 vs 10 vs 15-minute holds against group conversion and released-seat rates."],
              ["Split snacks and add-ons", "Let each friend add their own popcorn and combos to their share."],
              ["Smart groups", "Remember regular movie groups so the organiser can split in one tap next time."],
            ].map(([t, d], i) => (
              <Card key={t}>
                <span className="text-sm font-semibold text-accent tabular-nums">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Card dark className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xl font-semibold tracking-tight">The best group feature isn&apos;t splitting the bill — it&apos;s never having to ask for the money.</p>
          <Link href="/" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black">
            More work <Icon.arrow className="size-4" />
          </Link>
        </Card>

        <p className="px-1 pt-2 text-[12px] leading-relaxed text-muted">
          Split Pay is a self-initiated concept. It is not affiliated with, endorsed by, or built for BookMyShow. The movie, cinema, people and prices shown are fictional.
        </p>
        <div className="tile relative h-[96px] overflow-hidden"><ThemeToggle /></div>
        <p className="py-6 text-center text-xs text-muted">© {new Date().getFullYear()} {profile.fullName}.</p>
      </div>
    </main>
  );
}
