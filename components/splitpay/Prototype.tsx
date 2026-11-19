"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "./Phone";
import { Screen } from "./screens";
import { screenMeta as screens, screenOrder, type ScreenId } from "@/lib/splitpay/screenMeta";
import type { Status } from "@/lib/splitpay/data";

const HOLD = 600; // 10-minute seat hold

/** Scripted "friends paying" timeline for the live status screen (seconds after invites go out). */
const script: { at: number; id: string; s: Status }[] = [
  { at: 2, id: "meera", s: "paid" },
  { at: 3, id: "kabir", s: "paying" },
  { at: 5, id: "zoya", s: "opened" },
  { at: 6, id: "kabir", s: "paid" },
  { at: 8, id: "zoya", s: "paying" },
  { at: 10, id: "zoya", s: "paid" },
];
const startStatuses: Record<string, Status> = { you: "paid", priya: "paid", rahul: "paid", meera: "paying", kabir: "opened", zoya: "sent" };

const flows = ["Today", "Organiser", "Friend", "Edge case"] as const;

/** Clickable prototype: tap buttons inside the phone, or jump via the screen list. */
export function Prototype({ initial = "s1-seats" as ScreenId, width = 340 }) {
  const [id, setId] = useState<ScreenId>(initial);
  const [clock, setClock] = useState(HOLD);
  const [statuses, setStatuses] = useState(startStatuses);
  const t0 = useRef<number | null>(null);

  // live hold timer + scripted payments while the organiser watches the status screen
  useEffect(() => {
    if (id !== "s3-status") {
      t0.current = null;
      return;
    }
    t0.current = Date.now();
    setStatuses(startStatuses);
    setClock(522);
    const tick = setInterval(() => {
      const el = (Date.now() - (t0.current ?? Date.now())) / 1000;
      setClock(Math.max(0, 522 - el));
      const next = { ...startStatuses };
      script.forEach((e) => {
        if (el >= e.at) next[e.id] = e.s;
      });
      setStatuses(next);
      if (Object.values(next).every((v) => v === "paid") && el > 11.5) {
        clearInterval(tick);
        setId("s4-confirmed");
      }
    }, 250);
    return () => clearInterval(tick);
  }, [id]);

  // friend-side timers just count down
  useEffect(() => {
    if (!["f1-invite", "f2-upi", "e3-failed"].includes(id)) return;
    const start = Date.now();
    const base = id === "f1-invite" ? 492 : id === "f2-upi" ? 470 : 371;
    setClock(base);
    const tick = setInterval(() => setClock(base - (Date.now() - start) / 1000), 500);
    return () => clearInterval(tick);
  }, [id]);

  const go = (next: ScreenId) => setId(next);

  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
      <Phone width={width}>
        <Screen id={id} go={go} clock={id === "s3-status" || id.startsWith("f") || id === "e3-failed" ? clock : undefined} statuses={id === "s3-status" ? statuses : undefined} />
      </Phone>

      <nav aria-label="Prototype screens" className="w-full max-w-[320px] space-y-5">
        {flows.map((f) => (
          <div key={f}>
            <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{f}</p>
            <div className="space-y-1">
              {screenOrder
                .filter((s) => screens[s].flow === f)
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => setId(s)}
                    aria-current={s === id}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-[14px] transition-colors ${s === id ? "bg-ink text-page" : "hover:bg-chip"}`}
                  >
                    {screens[s].title}
                  </button>
                ))}
            </div>
          </div>
        ))}
        <p className="rounded-xl bg-chip p-3 text-[12px] leading-relaxed text-muted">
          Tip: tap the buttons inside the phone. On <b className="text-ink">Live group status</b>, friends pay in real time and the booking confirms itself.
        </p>
      </nav>
    </div>
  );
}
