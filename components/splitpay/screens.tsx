"use client";

/*
 * Split Pay — unofficial concept screens for a movie-ticketing app.
 * Every screen is a fixed 390×844 artboard (iPhone 14/15 logical size) that always
 * renders in the app's light theme, independent of the portfolio's dark mode.
 */

import type { ReactNode } from "react";
import { group, groupSeats, inr, perHead, rows, seatsPerRow, show, sold, total, type Member, type Status } from "@/lib/splitpay/data";
import type { ScreenId } from "@/lib/splitpay/screenMeta";

export type { ScreenId };

export type ScreenProps = {
  go?: (id: ScreenId) => void;
  /** seconds left on the seat hold */
  clock?: number;
  /** live payment status per member id */
  statuses?: Partial<Record<string, Status>>;
};

/* ------------------------------------------------------------------ tokens */
const C = {
  brand: "#F84464",
  brandDark: "#D93A57",
  ink: "#1F2533",
  sub: "#666B78",
  faint: "#9A9FAB",
  line: "#E8E8EE",
  bg: "#F2F2F7",
  green: "#1EA83C",
  ok: "#0E9F6E",
  warn: "#C77700",
  danger: "#D92D20",
};

const mmss = (s: number) => {
  const v = Math.max(0, Math.round(s));
  return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
};

/* -------------------------------------------------------------- primitives */
function Artboard({ children, bg = C.bg, dark = false }: { children: ReactNode; bg?: string; dark?: boolean }) {
  return (
    <div
      className="relative flex h-[844px] w-[390px] flex-col overflow-hidden antialiased"
      style={{ background: bg, color: C.ink, fontFamily: "Roboto, system-ui, sans-serif" }}
    >
      <StatusBar dark={dark} />
      {children}
    </div>
  );
}

function StatusBar({ dark }: { dark?: boolean }) {
  const col = dark ? "#fff" : C.ink;
  return (
    <div className="flex h-[47px] shrink-0 items-end justify-between px-8 pb-2 text-[15px] font-semibold" style={{ color: col }}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill={col} aria-hidden><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill={col} aria-hidden><path d="M8 2.2c2.2 0 4.2.9 5.7 2.3l1.1-1.1A9.6 9.6 0 0 0 8 .6 9.6 9.6 0 0 0 1.2 3.4l1.1 1.1A8 8 0 0 1 8 2.2Zm0 3.2c1.3 0 2.5.5 3.4 1.3l1.1-1.1A6.4 6.4 0 0 0 8 3.8c-1.7 0-3.3.7-4.5 1.8l1.1 1.1c.9-.8 2.1-1.3 3.4-1.3Zm0 3.2c-.5 0-.9.2-1.2.5L8 10.4l1.2-1.3c-.3-.3-.7-.5-1.2-.5Z" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke={col} opacity=".4" /><rect x="2" y="2" width="17" height="8" rx="1.8" fill={col} /><rect x="23.5" y="4" width="1.6" height="4" rx=".8" fill={col} opacity=".4" /></svg>
      </span>
    </div>
  );
}

function Header({ title, sub, onBack, right }: { title: string; sub?: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b bg-white px-4 py-3" style={{ borderColor: C.line }}>
      <button onClick={onBack} aria-label="Back" className="grid size-8 place-items-center rounded-full">
        <svg width="10" height="17" viewBox="0 0 10 17" fill="none" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8.5 1.5 1.5 8.5l7 7" /></svg>
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-medium">{title}</p>
        {sub && <p className="truncate text-[12px]" style={{ color: C.sub }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function Avatar({ m, size = 36, ring }: { m: Pick<Member, "name" | "color">; size?: number; ring?: string }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-medium text-white"
      style={{ width: size, height: size, background: m.color, fontSize: size * 0.42, boxShadow: ring ? `0 0 0 2px ${ring}` : undefined }}
    >
      {m.name[0]}
    </span>
  );
}

const statusStyle: Record<Status, { label: string; fg: string; bg: string }> = {
  paid: { label: "Paid", fg: C.ok, bg: "#E6F7F0" },
  paying: { label: "Paying…", fg: C.warn, bg: "#FFF4E0" },
  opened: { label: "Opened link", fg: "#2F6FED", bg: "#E9F0FF" },
  sent: { label: "Invite sent", fg: C.sub, bg: "#F0F0F4" },
  failed: { label: "Payment failed", fg: C.danger, bg: "#FDECEA" },
  dropped: { label: "Can't make it", fg: C.danger, bg: "#FDECEA" },
  released: { label: "Seat released", fg: C.faint, bg: "#F0F0F4" },
};

function Chip({ s }: { s: Status }) {
  const st = statusStyle[s];
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-medium" style={{ color: st.fg, background: st.bg }}>
      {s === "paid" && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="m2 5.2 2 2L8 3" /></svg>}
      {s === "paying" && <span className="size-1.5 animate-pulse rounded-full" style={{ background: st.fg }} />}
      {st.label}
    </span>
  );
}

function PrimaryButton({ children, onClick, tone = "brand", className = "" }: { children: ReactNode; onClick?: () => void; tone?: "brand" | "dark" | "ghost"; className?: string }) {
  const style =
    tone === "brand"
      ? { background: C.brand, color: "#fff" }
      : tone === "dark"
        ? { background: C.ink, color: "#fff" }
        : { background: "#fff", color: C.brand, boxShadow: `inset 0 0 0 1.5px ${C.brand}` };
  return (
    <button onClick={onClick} className={`h-12 w-full rounded-lg text-[15px] font-medium tracking-[0.01em] ${className}`} style={style}>
      {children}
    </button>
  );
}

function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="mt-auto shrink-0 border-t bg-white px-4 pt-3 pb-8" style={{ borderColor: C.line, boxShadow: "0 -6px 16px -10px rgba(0,0,0,.15)" }}>
      {children}
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-white ${className}`} style={{ boxShadow: "0 1px 2px rgba(16,24,40,.06)" }}>{children}</div>;
}

/** Fictional film poster — abstract artwork, no real imagery. */
function Poster({ w = 64, h = 92 }: { w?: number; h?: number }) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-md" style={{ width: w, height: h, background: "linear-gradient(160deg,#0E2A47 0%,#1C4E6E 45%,#E8A13A 100%)" }}>
      <div className="absolute inset-x-0 top-[38%] h-[2px] bg-white/30" />
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} className="absolute w-px bg-white/40" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 60}%`, height: `${8 + ((i * 7) % 14)}px`, transform: "rotate(12deg)" }} />
      ))}
      <span className="absolute inset-x-1 bottom-1.5 text-center leading-[1.05] font-bold text-white uppercase" style={{ fontSize: w * 0.14 }}>
        Monsoon
        <br />
        Heist
      </span>
    </div>
  );
}

function ShowSummary({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex gap-3">
      <Poster w={compact ? 48 : 64} h={compact ? 68 : 92} />
      <div className="min-w-0">
        <p className="text-[15px] font-medium">{show.movie}</p>
        <p className="mt-0.5 text-[12px]" style={{ color: C.sub }}>{show.cert} · {show.lang}</p>
        <p className="mt-1.5 text-[12px]" style={{ color: C.sub }}>{show.cinema}</p>
        <p className="text-[12px]" style={{ color: C.sub }}>{show.date} · {show.time} · {show.audi}</p>
      </div>
    </div>
  );
}

/** Seat hold timer: a pill with a draining ring. */
function HoldTimer({ clock = 522, of = 600, tone }: { clock?: number; of?: number; tone?: "warn" | "ok" }) {
  const urgent = tone === "warn" || clock < 120;
  const col = urgent ? C.danger : C.ink;
  const pct = Math.max(0, Math.min(1, clock / of));
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium tabular-nums" style={{ background: urgent ? "#FDECEA" : "#F0F0F4", color: col }}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
        <circle cx="11" cy="11" r={r} fill="none" stroke={urgent ? "#F6C4BF" : "#D9DAE1"} strokeWidth="2.5" />
        <circle cx="11" cy="11" r={r} fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 11 11)" />
      </svg>
      {mmss(clock)}
    </span>
  );
}

/** Deterministic QR-like pattern for the mock ticket. */
function QR({ seed = 7, size = 120 }: { seed?: number; size?: number }) {
  const n = 25;
  const cells: ReactNode[] = [];
  let x = seed * 9301 + 49297;
  const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  const finder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    return inBox(0, 0) || inBox(0, n - 7) || inBox(n - 7, 0);
  };
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      if (finder(r, c)) continue;
      if (rnd() > 0.52) cells.push(<rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" />);
    }
  const Finder = ({ r, c }: { r: number; c: number }) => (
    <g>
      <rect x={c} y={r} width="7" height="7" />
      <rect x={c + 1} y={r + 1} width="5" height="5" fill="#fff" />
      <rect x={c + 2} y={r + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} shapeRendering="crispEdges" fill={C.ink} aria-label="Ticket QR code (sample)">
      {cells}
      <Finder r={0} c={0} />
      <Finder r={0} c={n - 7} />
      <Finder r={n - 7} c={0} />
    </svg>
  );
}

/* -------------------------------------------------------------- seat map */
function SeatMap({ highlight }: { highlight?: Set<string> }) {
  const hi = highlight ?? groupSeats;
  return (
    <div className="px-3">
      <p className="mb-2 text-center text-[11px] tracking-[0.12em]" style={{ color: C.faint }}>₹{show.seatPrice} {show.tier}</p>
      <div className="space-y-[9px]">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-[5px]">
            <span className="w-3 text-[10px]" style={{ color: C.faint }}>{row}</span>
            {Array.from({ length: seatsPerRow }).map((_, i) => {
              const id = `${row}${i + 1}`;
              const isSold = sold.has(id);
              const isMine = hi.has(id);
              return (
                <span
                  key={id}
                  className={`grid h-[17px] w-[17px] place-items-center rounded-[4px] text-[8px] ${i === 7 ? "mr-3" : ""}`}
                  style={
                    isMine
                      ? { background: C.green, color: "#fff" }
                      : isSold
                        ? { background: "#E1E2E8", color: "transparent" }
                        : { boxShadow: `inset 0 0 0 1px ${C.green}`, color: C.green, background: "#fff" }
                  }
                >
                  {isMine ? i + 1 : isSold ? "" : i + 1}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-5 h-2 w-[78%] rounded-[50%] border-t-4" style={{ borderColor: "#C9D6F2" }} />
      <p className="mt-1 text-center text-[10px] tracking-[0.2em]" style={{ color: C.faint }}>SCREEN THIS WAY</p>
    </div>
  );
}

/* ==================================================================== SCREENS */

/** C0 — today's flow: one person pays for everyone. */
function TodayCheckout() {
  return (
    <Artboard>
      <Header title="Booking summary" sub={`${show.movie} · ${show.date}`} />
      <div className="flex-1 space-y-3 overflow-hidden p-4">
        <Card className="p-4">
          <ShowSummary />
          <div className="mt-4 flex items-center justify-between border-t pt-3 text-[13px]" style={{ borderColor: C.line }}>
            <span style={{ color: C.sub }}>6 tickets · G6–G11</span>
            <span className="font-medium">{inr(show.seatPrice * 6)}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[13px]">
            <span style={{ color: C.sub }}>Convenience fees</span>
            <span>{inr(show.fee * 6)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-3 text-[15px] font-medium" style={{ borderColor: C.line }}>
            <span>Amount payable</span>
            <span>{inr(total)}</span>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-[13px] font-medium">Pay using</p>
          {["UPI", "Debit / Credit card", "Net banking"].map((m, i) => (
            <div key={m} className="mt-3 flex items-center justify-between text-[13px]">
              <span>{m}</span>
              <span className="size-4 rounded-full" style={{ boxShadow: `inset 0 0 0 ${i === 0 ? 5 : 1.5}px ${i === 0 ? C.brand : "#C5C7D0"}` }} />
            </div>
          ))}
        </Card>
      </div>
      <BottomBar>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[12px]" style={{ color: C.sub }}>One person pays for all 6</span>
          <span className="text-[17px] font-semibold">{inr(total)}</span>
        </div>
        <PrimaryButton>Proceed to pay</PrimaryButton>
      </BottomBar>
    </Artboard>
  );
}

/** S1 — seat selection with the new "Split with friends" entry point. */
function SeatSelection({ go }: ScreenProps) {
  return (
    <Artboard bg="#fff">
      <Header title={show.movie} sub={`${show.cinema} · ${show.date}, ${show.time}`} right={<span className="rounded-md border px-2 py-1 text-[12px]" style={{ borderColor: C.line }}>6 Tickets</span>} />
      {/* showtimes */}
      <div className="flex shrink-0 items-center gap-2 overflow-hidden border-b px-4 py-3" style={{ borderColor: C.line }}>
        <span className="mr-1 shrink-0 text-[12px] leading-tight font-medium whitespace-nowrap" style={{ color: C.sub }}>
          SAT
          <br />
          <span className="text-[15px]" style={{ color: C.ink }}>22</span>
        </span>
        {["01:15 PM", "04:20 PM", show.time, "10:45 PM"].map((t) => {
          const on = t === show.time;
          return (
            <span
              key={t}
              className="shrink-0 rounded-lg px-2.5 py-2 text-[12px] font-medium whitespace-nowrap"
              style={on ? { background: C.green, color: "#fff" } : { color: C.green, boxShadow: `inset 0 0 0 1px ${C.green}` }}
            >
              {t}
            </span>
          );
        })}
      </div>
      <div className="flex-1 overflow-hidden pt-6">
        <SeatMap />
        <div className="mt-5 flex justify-center gap-5 text-[11px]" style={{ color: C.sub }}>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-[3px] bg-white" style={{ boxShadow: `inset 0 0 0 1px ${C.green}` }} />Available</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-[3px]" style={{ background: C.green }} />Selected</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-[3px] bg-[#E1E2E8]" />Sold</span>
        </div>
      </div>
      <BottomBar>
        {/* New entry point */}
        <button onClick={() => go?.("s2-split")} className="mb-3 flex w-full items-center gap-3 rounded-xl p-3 text-left" style={{ background: "#FFF1F3", boxShadow: `inset 0 0 0 1px #FFD0D8` }}>
          <span className="flex -space-x-2">
            {group.slice(1, 4).map((m) => <Avatar key={m.id} m={m} size={26} ring="#FFF1F3" />)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-medium">Going with friends? Split it.</span>
            <span className="block text-[11.5px]" style={{ color: C.sub }}>Hold all 6 seats · everyone pays for their own</span>
          </span>
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none" stroke={C.brand} strokeWidth="2" strokeLinecap="round" aria-hidden><path d="m1.5 1.5 5 5-5 5" /></svg>
        </button>
        <div className="grid grid-cols-[1fr_1.15fr] gap-2">
          <PrimaryButton tone="ghost">Pay {inr(total)}</PrimaryButton>
          <PrimaryButton onClick={() => go?.("s2-split")}>Split with friends</PrimaryButton>
        </div>
      </BottomBar>
    </Artboard>
  );
}

/** S2 — assign seats & invite. */
function SplitSetup({ go }: ScreenProps) {
  return (
    <Artboard>
      <Header title="Split with friends" sub="6 seats · G6–G11" onBack={() => go?.("s1-seats")} />
      <div className="flex-1 space-y-3 overflow-hidden p-4">
        <Card className="p-4">
          <ShowSummary compact />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium">Who&apos;s sitting where</p>
            <span className="text-[12px] font-medium" style={{ color: C.brand }}>Add from contacts</span>
          </div>
          <div className="mt-2">
            {group.map((m) => (
              <div key={m.id} className="flex items-center gap-3 border-b py-[7px] last:border-0" style={{ borderColor: C.line }}>
                <span className="w-9 rounded-md py-1 text-center text-[12px] font-medium" style={{ background: "#E9F7EC", color: C.green }}>{m.seat}</span>
                <Avatar m={m} size={28} />
                <span className="flex-1 text-[13.5px]">{m.you ? "You" : m.name}</span>
                <span className="text-[13px]" style={{ color: m.you ? C.ink : C.sub }}>{inr(perHead)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex gap-3 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full" style={{ background: "#FFF1F3" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.brand} strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" /></svg>
          </span>
          <div>
            <p className="text-[13px] font-medium">Seats held for 10 minutes</p>
            <p className="mt-0.5 text-[12px] leading-[1.45]" style={{ color: C.sub }}>
              Friends pay from a link, no app needed. Miss the timer? You choose: cover the seat or release it.
            </p>
          </div>
        </Card>
      </div>
      <BottomBar>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[12px]" style={{ color: C.sub }}>You pay now (seat G6)</p>
            <p className="text-[17px] font-semibold">{inr(perHead)}</p>
          </div>
          <p className="text-right text-[11.5px]" style={{ color: C.sub }}>Friends pay {inr(perHead)} each<br />Total {inr(total)}</p>
        </div>
        <PrimaryButton onClick={() => go?.("s3-status")}>Pay {inr(perHead)} & send invites</PrimaryButton>
      </BottomBar>
    </Artboard>
  );
}

const defaultStatuses: Record<string, Status> = { you: "paid", priya: "paid", rahul: "paid", meera: "paying", kabir: "opened", zoya: "sent" };

function MemberRow({ m, s, action }: { m: Member; s: Status; action?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b py-3 last:border-0" style={{ borderColor: C.line, opacity: s === "released" ? 0.55 : 1 }}>
      <Avatar m={m} size={34} />
      <div className="min-w-0 flex-1">
        <p className="text-[14px]">{m.you ? "You" : m.name} <span className="text-[12px]" style={{ color: C.faint }}>· {m.seat}</span></p>
        <div className="mt-1"><Chip s={s} /></div>
      </div>
      {action}
    </div>
  );
}

/** S3 — live group status for the organiser. */
function LiveStatus({ go, clock = 522, statuses }: ScreenProps) {
  const st = { ...defaultStatuses, ...statuses } as Record<string, Status>;
  const paid = group.filter((m) => st[m.id] === "paid").length;
  const pending = group.filter((m) => st[m.id] !== "paid" && st[m.id] !== "released");
  return (
    <Artboard>
      <Header title="Your group booking" sub={`${show.movie} · ${show.date}, ${show.time}`} onBack={() => go?.("s2-split")} right={<HoldTimer clock={clock} />} />
      <div className="flex-1 space-y-3 overflow-hidden p-4">
        <Card className="p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-[22px] font-semibold">{paid} of {group.length} paid</p>
            <p className="text-[12px]" style={{ color: C.sub }}>{inr(paid * perHead)} of {inr(total)}</p>
          </div>
          <div className="mt-3 flex gap-1">
            {group.map((m) => (
              <span key={m.id} className="h-1.5 flex-1 rounded-full transition-colors duration-500" style={{ background: st[m.id] === "paid" ? C.ok : st[m.id] === "paying" ? "#F5C46B" : "#E1E2E8" }} />
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[12px]" style={{ color: C.sub }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
            All 6 seats are locked for your group
          </p>
        </Card>
        <Card className="px-4">
          {group.map((m) => (
            <MemberRow
              key={m.id}
              m={m}
              s={st[m.id]}
              action={
                st[m.id] === "sent" || st[m.id] === "opened" ? (
                  <button className="rounded-full px-3 py-1.5 text-[12px] font-medium" style={{ color: C.brand, boxShadow: `inset 0 0 0 1px ${C.brand}` }}>Nudge</button>
                ) : null
              }
            />
          ))}
        </Card>
      </div>
      <BottomBar>
        <div className="grid grid-cols-2 gap-2">
          <PrimaryButton tone="ghost">Share link</PrimaryButton>
          <PrimaryButton onClick={() => go?.("e1-expiring")} tone="dark">Cover {pending.length} · {inr(pending.length * perHead)}</PrimaryButton>
        </div>
      </BottomBar>
    </Artboard>
  );
}

function SuccessMark() {
  return (
    <span className="grid size-16 place-items-center rounded-full" style={{ background: "#E6F7F0" }}>
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.ok} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
    </span>
  );
}

/** S4 — everyone paid. */
function GroupConfirmed({ go }: ScreenProps) {
  return (
    <Artboard>
      <Header title="Booking confirmed" onBack={() => go?.("s3-status")} />
      <div className="flex-1 overflow-hidden p-4">
        <div className="flex flex-col items-center pt-4 pb-5 text-center">
          <SuccessMark />
          <p className="mt-4 text-[20px] font-semibold">All 6 seats booked</p>
          <p className="mt-1 text-[13px]" style={{ color: C.sub }}>Everyone paid for their own seat. Nothing to collect.</p>
        </div>
        <Card className="overflow-hidden">
          <div className="p-4"><ShowSummary /></div>
          <div className="flex border-t border-dashed px-4 py-3" style={{ borderColor: "#D5D6DE" }}>
            <div className="flex-1">
              <p className="text-[11px]" style={{ color: C.faint }}>SEATS</p>
              <p className="text-[14px] font-medium">G6 – G11</p>
            </div>
            <div className="flex-1">
              <p className="text-[11px]" style={{ color: C.faint }}>BOOKING ID</p>
              <p className="text-[14px] font-medium">TKT9 4XR2</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t px-4 py-3" style={{ borderColor: C.line }}>
            <span className="flex -space-x-2">{group.map((m) => <Avatar key={m.id} m={m} size={24} ring="#fff" />)}</span>
            <p className="text-[12px]" style={{ color: C.sub }}>Each friend has their own M-ticket</p>
          </div>
        </Card>
        <Card className="mt-3 flex items-center justify-between p-4 text-[13px]">
          <span style={{ color: C.sub }}>You paid</span>
          <span className="font-medium">{inr(perHead)} <span style={{ color: C.faint }}>· seat G6</span></span>
        </Card>
      </div>
      <BottomBar>
        <div className="grid grid-cols-2 gap-2">
          <PrimaryButton tone="ghost">Share in group</PrimaryButton>
          <PrimaryButton>View my ticket</PrimaryButton>
        </div>
      </BottomBar>
    </Artboard>
  );
}

/** Browser chrome for the friend's mobile-web invite. */
function BrowserBar() {
  return (
    <div className="shrink-0 px-3 pb-2">
      <div className="flex h-9 items-center gap-2 rounded-xl px-3 text-[13px]" style={{ background: "#ECECF1", color: C.sub }}>
        <svg width="11" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
        <span className="flex-1 text-center">tickets.example/split/7KQ2</span>
      </div>
    </div>
  );
}

const friend = group[2]; // Rahul — seat G8
const organiser = group[0];

/** F1 — friend opens the invite link (no app). */
function InviteLanding({ go, clock = 492 }: ScreenProps) {
  return (
    <Artboard bg="#fff">
      <BrowserBar />
      <div className="flex-1 overflow-hidden">
        <div className="px-5 pt-4 pb-5" style={{ background: "linear-gradient(180deg,#FFF1F3 0%,#fff 100%)" }}>
          <div className="flex items-center gap-2.5">
            <Avatar m={organiser} size={32} />
            <p className="text-[13px]" style={{ color: C.sub }}><b style={{ color: C.ink }}>{organiser.name}</b> saved you a seat</p>
          </div>
          <div className="mt-4 flex gap-4">
            <Poster w={92} h={132} />
            <div className="pt-1">
              <p className="text-[19px] leading-tight font-semibold">{show.movie}</p>
              <p className="mt-1 text-[12px]" style={{ color: C.sub }}>{show.cert} · {show.lang} · {show.runtime}</p>
              <p className="mt-3 text-[13px] font-medium">{show.date} · {show.time}</p>
              <p className="text-[12px]" style={{ color: C.sub }}>{show.cinema}, {show.city}</p>
            </div>
          </div>
        </div>

        <div className="px-5">
          <p className="text-[12px] font-medium tracking-[0.06em]" style={{ color: C.faint }}>YOUR SEAT</p>
          <div className="mt-2 flex items-center gap-[6px]">
            {group.map((m) => (
              <span
                key={m.id}
                className="grid h-9 flex-1 place-items-center rounded-md text-[12px] font-medium"
                style={m.id === friend.id ? { background: C.green, color: "#fff" } : { background: "#F0F0F4", color: C.faint }}
              >
                {m.seat}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[12px]" style={{ color: C.sub }}>You&apos;re sitting with Arjun, Priya, Meera, Kabir and Zoya</p>

          <div className="mt-5 space-y-1.5 rounded-xl p-4 text-[13px]" style={{ background: "#F7F7FA" }}>
            <div className="flex justify-between"><span style={{ color: C.sub }}>Ticket · {friend.seat}</span><span>{inr(show.seatPrice)}</span></div>
            <div className="flex justify-between"><span style={{ color: C.sub }}>Convenience fee</span><span>{inr(show.fee)}</span></div>
            <div className="flex justify-between border-t pt-2 text-[15px] font-medium" style={{ borderColor: C.line }}><span>Your share</span><span>{inr(perHead)}</span></div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "#FFF8EC" }}>
            <span className="text-[12.5px]" style={{ color: "#8A5300" }}>Pay before the hold ends or the seat is released</span>
            <HoldTimer clock={clock} />
          </div>
        </div>
      </div>
      <BottomBar>
        <PrimaryButton onClick={() => go?.("f2-upi")}>Pay {inr(perHead)} with UPI</PrimaryButton>
        <button onClick={() => go?.("e4-dropout")} className="mt-2 w-full py-2 text-[13px] font-medium" style={{ color: C.sub }}>I can&apos;t make it</button>
      </BottomBar>
    </Artboard>
  );
}

const upiApps = [
  { name: "Google Pay", c: "#4285F4" },
  { name: "PhonePe", c: "#5F259F" },
  { name: "Paytm", c: "#00BAF2" },
  { name: "BHIM", c: "#F47920" },
];

/** F2 — UPI sheet. */
function UpiSheet({ go, clock = 470 }: ScreenProps) {
  return (
    <div className="relative">
      <InviteLanding clock={clock} />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] bg-white px-5 pt-3 pb-8" style={{ fontFamily: "Roboto, system-ui, sans-serif", color: C.ink }}>
        <span className="mx-auto block h-1 w-10 rounded-full bg-[#D5D6DE]" />
        <div className="mt-4 flex items-start justify-between">
          <div>
            <p className="text-[17px] font-semibold">Pay {inr(perHead)}</p>
            <p className="text-[12px]" style={{ color: C.sub }}>Seat {friend.seat} · {show.movie}</p>
          </div>
          <HoldTimer clock={clock} />
        </div>
        <p className="mt-5 text-[12px] font-medium tracking-[0.06em]" style={{ color: C.faint }}>PAY WITH A UPI APP</p>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {upiApps.map((a, i) => (
            <button key={a.name} onClick={() => go?.("f3-ticket")} className="flex flex-col items-center gap-1.5">
              <span className="grid size-12 place-items-center rounded-2xl text-[17px] font-semibold text-white" style={{ background: a.c, boxShadow: i === 0 ? `0 0 0 2px #fff, 0 0 0 4px ${C.brand}` : undefined }}>{a.name[0]}</span>
              <span className="text-[11px]" style={{ color: C.sub }}>{a.name}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3" style={{ boxShadow: `inset 0 0 0 1px ${C.line}` }}>
          <span className="text-[13px]" style={{ color: C.faint }}>Or enter UPI ID</span>
          <span className="ml-auto text-[13px] font-medium" style={{ color: C.brand }}>Verify</span>
        </div>
        <PrimaryButton className="mt-5" onClick={() => go?.("f3-ticket")}>Pay {inr(perHead)} via Google Pay</PrimaryButton>
        <p className="mt-2.5 text-center text-[11px]" style={{ color: C.faint }}>Refunded automatically if the group booking doesn&apos;t go through</p>
      </div>
    </div>
  );
}

/** F3 — friend's ticket. */
function FriendTicket({ go }: ScreenProps) {
  return (
    <Artboard>
      <BrowserBar />
      <div className="flex-1 overflow-hidden px-4 pt-2">
        <div className="flex flex-col items-center pt-2 pb-4 text-center">
          <SuccessMark />
          <p className="mt-3 text-[20px] font-semibold">You&apos;re in, {friend.name}!</p>
          <p className="mt-1 text-[13px]" style={{ color: C.sub }}>Seat {friend.seat} is yours. We&apos;ve told Arjun.</p>
        </div>
        <Card className="overflow-hidden">
          <div className="p-4"><ShowSummary compact /></div>
          <div className="relative border-t border-dashed" style={{ borderColor: "#D5D6DE" }}>
            <span className="absolute -top-2.5 -left-2.5 size-5 rounded-full" style={{ background: C.bg }} />
            <span className="absolute -top-2.5 -right-2.5 size-5 rounded-full" style={{ background: C.bg }} />
          </div>
          <div className="flex items-center gap-4 p-4">
            <QR seed={8} size={104} />
            <div className="space-y-2 text-[12px]">
              <div><p style={{ color: C.faint }}>SEAT</p><p className="text-[16px] font-semibold">{show.audi} · {friend.seat}</p></div>
              <div><p style={{ color: C.faint }}>PAID</p><p className="text-[13px] font-medium">{inr(perHead)} · UPI</p></div>
            </div>
          </div>
        </Card>
        <Card className="mt-3 p-4">
          <p className="text-[12px]" style={{ color: C.sub }}>Group status</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex -space-x-2">{group.slice(0, 4).map((m) => <Avatar key={m.id} m={m} size={24} ring="#fff" />)}</span>
            <p className="text-[13px] font-medium">4 of 6 paid</p>
          </div>
        </Card>
      </div>
      <BottomBar>
        <PrimaryButton tone="ghost" onClick={() => go?.("f1-invite")}>Get the app for your M-ticket</PrimaryButton>
      </BottomBar>
    </Artboard>
  );
}

/** E1 — hold running out, organiser decides. */
function HoldExpiring({ go, clock = 88 }: ScreenProps) {
  const st: Record<string, Status> = { you: "paid", priya: "paid", rahul: "paid", meera: "paid", kabir: "opened", zoya: "sent" };
  return (
    <div className="relative">
      <LiveStatus clock={clock} statuses={st} />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] bg-white px-5 pt-3 pb-8" style={{ fontFamily: "Roboto, system-ui, sans-serif", color: C.ink }}>
        <span className="mx-auto block h-1 w-10 rounded-full bg-[#D5D6DE]" />
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[17px] font-semibold">2 friends haven&apos;t paid</p>
            <p className="mt-0.5 text-[12.5px]" style={{ color: C.sub }}>Kabir and Zoya&apos;s seats will be released when the hold ends.</p>
          </div>
          <HoldTimer clock={clock} tone="warn" />
        </div>
        <div className="mt-4 space-y-2">
          {[
            { t: "Give them 5 more minutes", d: "One-time extension · we'll nudge them again", tag: "Recommended" },
            { t: `Cover both seats · ${inr(perHead * 2)}`, d: "You pay now and collect later" },
            { t: "Release their seats", d: "Book the 4 who paid · others can join later if seats remain" },
          ].map((o, i) => (
            <button key={o.t} onClick={() => go?.(i === 2 ? "e2-expired" : "s3-status")} className="flex w-full items-start gap-3 rounded-xl p-3.5 text-left" style={{ boxShadow: `inset 0 0 0 ${i === 0 ? 1.5 : 1}px ${i === 0 ? C.brand : C.line}`, background: i === 0 ? "#FFF6F8" : "#fff" }}>
              <span className="mt-0.5 size-4 shrink-0 rounded-full" style={{ boxShadow: `inset 0 0 0 ${i === 0 ? 5 : 1.5}px ${i === 0 ? C.brand : "#C5C7D0"}` }} />
              <span className="flex-1">
                <span className="flex items-center gap-2 text-[14px] font-medium">{o.t}{o.tag && <span className="rounded px-1.5 py-0.5 text-[10px]" style={{ background: C.brand, color: "#fff" }}>{o.tag}</span>}</span>
                <span className="mt-0.5 block text-[12px]" style={{ color: C.sub }}>{o.d}</span>
              </span>
            </button>
          ))}
        </div>
        <PrimaryButton className="mt-4" onClick={() => go?.("s3-status")}>Extend by 5 minutes</PrimaryButton>
      </div>
    </div>
  );
}

/** E2 — hold expired, partial booking confirmed. */
function HoldExpired({ go }: ScreenProps) {
  const st: Record<string, Status> = { you: "paid", priya: "paid", rahul: "paid", meera: "paid", kabir: "released", zoya: "released" };
  return (
    <Artboard>
      <Header title="Booking confirmed for 4" sub={`${show.movie} · ${show.date}, ${show.time}`} onBack={() => go?.("s3-status")} />
      <div className="flex-1 space-y-3 overflow-hidden p-4">
        <Card className="flex gap-3 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full" style={{ background: "#FFF4E0" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.warn} strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M12 8v5M12 16.5v.5" /><circle cx="12" cy="12" r="9" /></svg>
          </span>
          <div>
            <p className="text-[14px] font-medium">2 seats were released</p>
            <p className="mt-0.5 text-[12.5px] leading-[1.45]" style={{ color: C.sub }}>Kabir and Zoya didn&apos;t pay in time. Nobody was charged for those seats, and we&apos;ve let them know.</p>
          </div>
        </Card>
        <Card className="px-4">
          {group.map((m) => <MemberRow key={m.id} m={m} s={st[m.id]} />)}
        </Card>
        <Card className="p-4">
          <p className="text-[13px] font-medium">G10 and G11 are still free</p>
          <p className="mt-0.5 text-[12px]" style={{ color: C.sub }}>Kabir and Zoya can still book them with the same link, but without a hold this time.</p>
        </Card>
      </div>
      <BottomBar>
        <div className="grid grid-cols-2 gap-2">
          <PrimaryButton tone="ghost">Re-share link</PrimaryButton>
          <PrimaryButton onClick={() => go?.("s4-confirmed")}>View tickets</PrimaryButton>
        </div>
      </BottomBar>
    </Artboard>
  );
}

/** E3 — friend's UPI payment failed. */
function PaymentFailed({ go, clock = 371 }: ScreenProps) {
  return (
    <Artboard bg="#fff">
      <BrowserBar />
      <div className="flex flex-1 flex-col items-center overflow-hidden px-6 pt-14 text-center">
        <span className="grid size-16 place-items-center rounded-full" style={{ background: "#FDECEA" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.danger} strokeWidth="2.6" strokeLinecap="round" aria-hidden><path d="M7 7l10 10M17 7 7 17" /></svg>
        </span>
        <p className="mt-5 text-[20px] font-semibold">Payment didn&apos;t go through</p>
        <p className="mt-2 text-[13.5px] leading-[1.5]" style={{ color: C.sub }}>
          Google Pay declined the payment. No money was taken. If it was, it&apos;ll be refunded within 48 hours.
        </p>
        <div className="mt-6 flex w-full items-center justify-between rounded-xl px-4 py-3" style={{ background: "#F7F7FA" }}>
          <span className="text-left text-[12.5px]" style={{ color: C.sub }}>Seat <b style={{ color: C.ink }}>{friend.seat}</b> is still held for you</span>
          <HoldTimer clock={clock} />
        </div>
        <div className="mt-3 w-full rounded-xl px-4 py-3 text-left text-[12.5px]" style={{ background: "#F7F7FA", color: C.sub }}>
          Arjun sees “Payment failed” and won&apos;t release your seat by mistake.
        </div>
      </div>
      <BottomBar>
        <PrimaryButton onClick={() => go?.("f2-upi")}>Try again</PrimaryButton>
        <button onClick={() => go?.("f2-upi")} className="mt-2 w-full py-2 text-[13px] font-medium" style={{ color: C.brand }}>Use another UPI app</button>
      </BottomBar>
    </Artboard>
  );
}

/** E4 — a friend who paid can't make it; organiser decides what happens to the seat. */
function Dropout({ go, clock = 600 }: ScreenProps) {
  const meera = group[3];
  const st: Record<string, Status> = { you: "paid", priya: "paid", rahul: "paid", meera: "dropped", kabir: "paid", zoya: "paid" };
  return (
    <div className="relative">
      <LiveStatus clock={clock} statuses={st} />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] bg-white px-5 pt-3 pb-8" style={{ fontFamily: "Roboto, system-ui, sans-serif", color: C.ink }}>
        <span className="mx-auto block h-1 w-10 rounded-full bg-[#D5D6DE]" />
        <div className="mt-4 flex items-center gap-3">
          <Avatar m={meera} size={40} />
          <div>
            <p className="text-[17px] font-semibold">Meera can&apos;t make it</p>
            <p className="text-[12.5px]" style={{ color: C.sub }}>Her seat {meera.seat} comes back to you for 10 minutes</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {[
            { t: "Invite someone else", d: `They pay ${inr(perHead)} · Meera is refunded automatically` },
            { t: "Keep the seat & pay for it", d: `You pay ${inr(perHead)} · Meera is refunded` },
            { t: "Cancel the seat", d: `Meera gets ${inr(show.seatPrice)} back · fee isn't refundable` },
          ].map((o, i) => (
            <button key={o.t} onClick={() => go?.("s3-status")} className="flex w-full items-start gap-3 rounded-xl p-3.5 text-left" style={{ boxShadow: `inset 0 0 0 ${i === 0 ? 1.5 : 1}px ${i === 0 ? C.brand : C.line}`, background: i === 0 ? "#FFF6F8" : "#fff" }}>
              <span className="mt-0.5 size-4 shrink-0 rounded-full" style={{ boxShadow: `inset 0 0 0 ${i === 0 ? 5 : 1.5}px ${i === 0 ? C.brand : "#C5C7D0"}` }} />
              <span className="flex-1">
                <span className="block text-[14px] font-medium">{o.t}</span>
                <span className="mt-0.5 block text-[12px]" style={{ color: C.sub }}>{o.d}</span>
              </span>
            </button>
          ))}
        </div>
        <PrimaryButton className="mt-4" onClick={() => go?.("s3-status")}>Share seat G9</PrimaryButton>
      </div>
    </div>
  );
}

/* -------------------------------------------------- more edge cases */

function Spinner({ col = C.warn, size = 64 }: { col?: string; size?: number }) {
  return (
    <span className="relative grid place-items-center rounded-full" style={{ width: size, height: size, background: "#FFF4E0" }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" className="animate-spin" style={{ animationDuration: "1.4s" }} aria-hidden>
        <circle cx="12" cy="12" r="9" fill="none" stroke="#F6D9A8" strokeWidth="2.6" />
        <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke={col} strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function StepRow({ state, label, sub }: { state: "done" | "doing" | "todo"; label: string; sub?: string }) {
  return (
    <div className="flex gap-3">
      <span
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full"
        style={
          state === "done"
            ? { background: C.ok }
            : state === "doing"
              ? { boxShadow: `inset 0 0 0 2px ${C.warn}` }
              : { boxShadow: `inset 0 0 0 1.5px #C5C7D0` }
        }
      >
        {state === "done" && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden><path d="m2 5.2 2 2L8 3" /></svg>}
        {state === "doing" && <span className="size-1.5 animate-pulse rounded-full" style={{ background: C.warn }} />}
      </span>
      <div>
        <p className="text-[13.5px]" style={{ color: state === "todo" ? C.faint : C.ink, fontWeight: state === "doing" ? 500 : 400 }}>{label}</p>
        {sub && <p className="text-[12px]" style={{ color: C.sub }}>{sub}</p>}
      </div>
    </div>
  );
}

/** E5 — UPI debited the money but hasn't confirmed yet (very common). */
function PaymentPending({ go }: ScreenProps) {
  return (
    <Artboard bg="#fff">
      <BrowserBar />
      <div className="flex flex-1 flex-col overflow-hidden px-5 pt-8">
        <div className="flex flex-col items-center text-center">
          <Spinner />
          <p className="mt-5 text-[20px] font-semibold">Confirming your payment</p>
          <p className="mt-2 text-[13.5px] leading-[1.5]" style={{ color: C.sub }}>
            {inr(perHead)} left your account, but Google Pay hasn&apos;t confirmed it to us yet. This usually takes under 2 minutes.
          </p>
        </div>

        <div className="mt-6 space-y-3.5 rounded-xl p-4" style={{ background: "#F7F7FA" }}>
          <StepRow state="done" label="Payment sent from Google Pay" sub="UPI ref 4381 2290 7716" />
          <StepRow state="doing" label="Waiting for your bank to confirm" />
          <StepRow state="todo" label={`Seat ${friend.seat} ticket issued`} />
        </div>

        <div className="mt-3 flex gap-3 rounded-xl p-4" style={{ background: "#E6F7F0" }}>
          <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.ok} strokeWidth="2.2" aria-hidden><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
          <div>
            <p className="text-[13.5px] font-medium" style={{ color: "#05603A" }}>Your seat {friend.seat} is safe</p>
            <p className="mt-0.5 text-[12.5px] leading-[1.45]" style={{ color: "#256B4D" }}>The hold is paused while we confirm, so it won&apos;t run out. Arjun sees “Confirming”.</p>
          </div>
        </div>

        <p className="mt-4 px-1 text-[12.5px] leading-[1.5]" style={{ color: C.sub }}>
          <b style={{ color: C.ink }}>Please don&apos;t pay again.</b> If this doesn&apos;t go through, {inr(perHead)} is refunded to your account automatically within 48 hours.
        </p>
      </div>
      <BottomBar>
        <PrimaryButton tone="ghost" onClick={() => go?.("f3-ticket")}>Check status</PrimaryButton>
        <p className="mt-2.5 text-center text-[11.5px]" style={{ color: C.faint }}>We&apos;ll also send you an SMS once it&apos;s confirmed</p>
      </BottomBar>
    </Artboard>
  );
}

/** E6 — the organiser applied a group offer; how is the saving shared? */
function GroupOffer({ go }: ScreenProps) {
  const off = 120;
  const each = perHead - off / group.length; // 330
  return (
    <Artboard>
      <Header title="Split with friends" sub="6 seats · G6–G11" onBack={() => go?.("s1-seats")} />
      <div className="flex-1 space-y-3 overflow-hidden p-4">
        <Card className="flex items-center gap-3 p-4" >
          <span className="grid size-9 shrink-0 place-items-center rounded-full" style={{ background: "#E6F7F0" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.ok} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-medium">FRIENDS120 applied</p>
            <p className="text-[12px]" style={{ color: C.sub }}>{inr(off)} off on 6 or more tickets</p>
          </div>
          <span className="text-[14px] font-semibold" style={{ color: C.ok }}>−{inr(off)}</span>
        </Card>

        <Card className="p-4">
          <p className="text-[13px] font-medium">Who gets the saving?</p>
          <div className="mt-3 space-y-2">
            {[
              { t: "Split it with everyone", d: `Everyone pays ${inr(each)} instead of ${inr(perHead)}`, tag: "Recommended", on: true },
              { t: "Keep it for yourself", d: `You pay ${inr(perHead - off)} · friends pay ${inr(perHead)}`, on: false },
            ].map((o) => (
              <div key={o.t} className="flex items-start gap-3 rounded-xl p-3.5" style={{ boxShadow: `inset 0 0 0 ${o.on ? 1.5 : 1}px ${o.on ? C.brand : C.line}`, background: o.on ? "#FFF6F8" : "#fff" }}>
                <span className="mt-0.5 size-4 shrink-0 rounded-full" style={{ boxShadow: `inset 0 0 0 ${o.on ? 5 : 1.5}px ${o.on ? C.brand : "#C5C7D0"}` }} />
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-[14px] font-medium">{o.t}{o.tag && <span className="rounded px-1.5 py-0.5 text-[10px]" style={{ background: C.brand, color: "#fff" }}>{o.tag}</span>}</span>
                  <span className="mt-0.5 block text-[12px]" style={{ color: C.sub }}>{o.d}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-[1.45]" style={{ color: C.sub }}>Friends see the discount on their invite, so nobody wonders why their share changed.</p>
        </Card>

        <Card className="space-y-1.5 p-4 text-[13px]">
          <div className="flex justify-between"><span style={{ color: C.sub }}>6 tickets + fees</span><span>{inr(total)}</span></div>
          <div className="flex justify-between"><span style={{ color: C.sub }}>FRIENDS120</span><span style={{ color: C.ok }}>−{inr(off)}</span></div>
          <div className="flex justify-between border-t pt-2 text-[14px] font-medium" style={{ borderColor: C.line }}><span>Group total</span><span>{inr(total - off)}</span></div>
        </Card>
      </div>
      <BottomBar>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[12px]" style={{ color: C.sub }}>You pay now (seat G6)</p>
            <p className="text-[17px] font-semibold">{inr(each)} <span className="text-[13px] font-normal line-through" style={{ color: C.faint }}>{inr(perHead)}</span></p>
          </div>
          <p className="text-right text-[11.5px]" style={{ color: C.sub }}>Friends pay {inr(each)} each</p>
        </div>
        <PrimaryButton onClick={() => go?.("s3-status")}>Pay {inr(each)} & send invites</PrimaryButton>
      </BottomBar>
    </Artboard>
  );
}

/** E7 — a friend opens the invite after the hold ended. */
function LinkAfterHold({ go }: ScreenProps) {
  const kabir = group[4];
  return (
    <Artboard bg="#fff">
      <BrowserBar />
      <div className="flex flex-1 flex-col overflow-hidden px-5 pt-6">
        <div className="flex items-center gap-2.5">
          <Avatar m={organiser} size={32} />
          <p className="text-[13px]" style={{ color: C.sub }}><b style={{ color: C.ink }}>{organiser.name}</b> invited you to {show.movie}</p>
        </div>

        <div className="mt-6 flex flex-col items-center text-center">
          <span className="grid size-16 place-items-center rounded-full" style={{ background: "#F0F0F4" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" /></svg>
          </span>
          <p className="mt-4 text-[20px] font-semibold">The hold on your seat ended</p>
          <p className="mt-2 text-[13.5px] leading-[1.5]" style={{ color: C.sub }}>
            Arjun&apos;s group booked 4 seats at 4:12 PM. Seat {kabir.seat} wasn&apos;t paid for in time, so it was released. Nobody was charged.
          </p>
        </div>

        <p className="mt-6 text-[12px] font-medium tracking-[0.06em]" style={{ color: C.faint }}>ROW G RIGHT NOW</p>
        <div className="mt-2 flex items-center gap-[6px]">
          {group.map((m) => {
            const booked = ["G6", "G7", "G8", "G9"].includes(m.seat);
            const mine = m.seat === kabir.seat;
            return (
              <span
                key={m.id}
                className="grid h-9 flex-1 place-items-center rounded-md text-[12px] font-medium"
                style={mine ? { boxShadow: `inset 0 0 0 1.5px ${C.green}`, color: C.green, background: "#F2FBF4" } : booked ? { background: "#E1E2E8", color: C.faint } : { background: "#E1E2E8", color: C.faint }}
              >
                {m.seat}
              </span>
            );
          })}
        </div>
        <p className="mt-2 text-[12px]" style={{ color: C.sub }}>G6–G9 are your friends · G11 has been taken</p>

        <div className="mt-5 rounded-xl p-4" style={{ background: "#F2FBF4", boxShadow: `inset 0 0 0 1px #CDEBD4` }}>
          <p className="text-[14px] font-medium" style={{ color: "#146C2E" }}>Good news: {kabir.seat} is still free</p>
          <p className="mt-0.5 text-[12.5px] leading-[1.45]" style={{ color: "#2F6B40" }}>Right next to your friends. It&apos;s no longer held for you, so book it before someone else does.</p>
        </div>
      </div>
      <BottomBar>
        <PrimaryButton onClick={() => go?.("f2-upi")}>Book {kabir.seat} · {inr(perHead)}</PrimaryButton>
        <button className="mt-2 w-full py-2 text-[13px] font-medium" style={{ color: C.sub }}>Tell Arjun I can&apos;t make it</button>
      </BottomBar>
    </Artboard>
  );
}

/** E8 — booking close to showtime: shorter hold. */
function ShowSoon({ go }: ScreenProps) {
  return (
    <Artboard>
      <Header title="Split with friends" sub="6 seats · G6–G11" onBack={() => go?.("s1-seats")} />
      <div className="flex-1 space-y-3 overflow-hidden p-4">
        <div className="flex gap-3 rounded-xl p-4" style={{ background: "#FFF4E0", boxShadow: "inset 0 0 0 1px #F7DDAE" }}>
          <svg className="mt-0.5 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.warn} strokeWidth="2.2" strokeLinecap="round" aria-hidden><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" /></svg>
          <div>
            <p className="text-[14px] font-medium" style={{ color: "#7A4A00" }}>Show starts in 25 minutes</p>
            <p className="mt-0.5 text-[12.5px] leading-[1.45]" style={{ color: "#8A5300" }}>
              Friends get <b>5 minutes</b> to pay instead of 10, so unpaid seats go back on sale in time for others.
            </p>
          </div>
        </div>

        <Card className="p-4"><ShowSummary compact /></Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium">Splitting with 5 friends</p>
            <span className="text-[12px]" style={{ color: C.sub }}>{inr(perHead)} each</span>
          </div>
          <div className="mt-3 flex -space-x-2">
            {group.map((m) => <Avatar key={m.id} m={m} size={34} ring="#fff" />)}
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-[12px] font-medium tracking-[0.06em]" style={{ color: C.faint }}>HOLD RULES CLOSE TO SHOWTIME</p>
          <div className="mt-3 space-y-2.5 text-[13px]">
            {[
              ["More than 1 hour away", "10 min hold"],
              ["30 min – 1 hour", "7 min hold"],
              ["15 – 30 min", "5 min hold"],
              ["Under 15 min", "Split unavailable"],
            ].map(([w, h], i) => (
              <div key={w} className="flex items-center justify-between" style={{ fontWeight: i === 2 ? 500 : 400, color: i === 2 ? C.ink : C.sub }}>
                <span className="flex items-center gap-2">{i === 2 && <span className="size-1.5 rounded-full" style={{ background: C.warn }} />}{w}</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <BottomBar>
        <div className="mb-3 flex items-center justify-between text-[12px]" style={{ color: C.sub }}>
          <span>Invites stop working at <b style={{ color: C.ink }}>7:10 PM</b></span>
          <HoldTimer clock={300} of={300} />
        </div>
        <PrimaryButton onClick={() => go?.("s3-status")}>Pay {inr(perHead)} & send invites</PrimaryButton>
      </BottomBar>
    </Artboard>
  );
}

/** E9 — organiser adds or removes people after invites went out. */
function EditGroup({ go, clock = 401 }: ScreenProps) {
  const st: Record<string, Status> = { you: "paid", priya: "paid", rahul: "paid", meera: "paid", kabir: "opened", zoya: "sent" };
  const dev = { name: "Dev", color: "#8B5CF6" };
  return (
    <div className="relative">
      <LiveStatus clock={clock} statuses={st} />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] bg-white px-5 pt-3 pb-8" style={{ fontFamily: "Roboto, system-ui, sans-serif", color: C.ink }}>
        <span className="mx-auto block h-1 w-10 rounded-full bg-[#D5D6DE]" />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[17px] font-semibold">Edit group</p>
          <HoldTimer clock={clock} />
        </div>

        <div className="mt-3">
          {group.map((m) => {
            const paid = st[m.id] === "paid";
            return (
              <div key={m.id} className="flex items-center gap-3 border-b py-2" style={{ borderColor: C.line, opacity: m.id === "zoya" ? 0.5 : 1 }}>
                <Avatar m={m} size={28} />
                <span className="flex-1 text-[13.5px]" style={{ textDecoration: m.id === "zoya" ? "line-through" : undefined }}>
                  {m.you ? "You" : m.name} <span className="text-[12px]" style={{ color: C.faint }}>· {m.seat}</span>
                </span>
                {m.you ? (
                  <span className="text-[12px]" style={{ color: C.faint }}>Organiser</span>
                ) : m.id === "zoya" ? (
                  <span className="text-[12px] font-medium" style={{ color: C.danger }}>Removed</span>
                ) : paid ? (
                  <span className="text-[12px] font-medium" style={{ color: C.sub }}>Remove & refund</span>
                ) : (
                  <span className="text-[12px] font-medium" style={{ color: C.danger }}>Remove</span>
                )}
              </div>
            );
          })}
          {/* new seat */}
          <div className="flex items-center gap-3 py-2">
            <Avatar m={dev} size={28} />
            <span className="flex-1 text-[13.5px]">Dev <span className="text-[12px]" style={{ color: C.faint }}>· G12 · new</span></span>
            <Chip s="sent" />
          </div>
        </div>

        <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-medium" style={{ color: C.brand, boxShadow: `inset 0 0 0 1px #FFD0D8`, background: "#FFF6F8" }}>
          + Add a seat next to your group
        </button>
        <p className="mt-2.5 text-[11.5px] leading-[1.45]" style={{ color: C.sub }}>
          Zoya&apos;s seat G11 is released. G12 is held for Dev on the same timer. Removing someone who paid refunds {inr(show.seatPrice)} to them.
        </p>
        <PrimaryButton className="mt-3" onClick={() => go?.("s3-status")}>Save changes</PrimaryButton>
      </div>
    </div>
  );
}

/* ================================================================ registry */
const renderers: Record<ScreenId, (p: ScreenProps) => ReactNode> = {
  "c0-today": () => <TodayCheckout />,
  "s1-seats": (p) => <SeatSelection {...p} />,
  "s2-split": (p) => <SplitSetup {...p} />,
  "s3-status": (p) => <LiveStatus {...p} />,
  "s4-confirmed": (p) => <GroupConfirmed {...p} />,
  "f1-invite": (p) => <InviteLanding {...p} />,
  "f2-upi": (p) => <UpiSheet {...p} />,
  "f3-ticket": (p) => <FriendTicket {...p} />,
  "e1-expiring": (p) => <HoldExpiring {...p} />,
  "e2-expired": (p) => <HoldExpired {...p} />,
  "e3-failed": (p) => <PaymentFailed {...p} />,
  "e4-dropout": (p) => <Dropout {...p} />,
  "e5-pending": (p) => <PaymentPending {...p} />,
  "e6-offer": (p) => <GroupOffer {...p} />,
  "e7-late-link": (p) => <LinkAfterHold {...p} />,
  "e8-show-soon": (p) => <ShowSoon {...p} />,
  "e9-edit-group": (p) => <EditGroup {...p} />,
};

export function Screen({ id, ...p }: { id: ScreenId } & ScreenProps) {
  return <>{renderers[id](p)}</>;
}
