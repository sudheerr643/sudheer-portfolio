import { toolLogos } from "@/lib/toolLogos";

/** ProtoPie isn't in the open logo set — neutral pie glyph stands in for it. */
function PieGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <circle cx="12" cy="12" r="9" className="fill-ink/10" />
      <path d="M12 3a9 9 0 0 1 9 9h-9V3Z" className="fill-ink" />
    </svg>
  );
}

const items = [
  ...toolLogos.slice(0, 3).map((t) => ({ ...t, glyph: null as null | "pie" })),
  { id: "protopie", name: "ProtoPie", viewBox: "", body: "", glyph: "pie" as const },
  ...toolLogos.slice(3).map((t) => ({ ...t, glyph: null as null | "pie" })),
];

function Item({ t }: { t: (typeof items)[number] }) {
  return (
    <li className="flex shrink-0 items-center gap-2.5 rounded-2xl bg-chip py-2.5 pr-4 pl-3">
      {t.glyph === "pie" ? (
        <PieGlyph />
      ) : (
        <svg
          viewBox={t.viewBox}
          className={`size-6 ${t.id === "framer" ? "dark:invert" : ""}`}
          aria-hidden
          dangerouslySetInnerHTML={{ __html: t.body }}
        />
      )}
      <span className="text-[14px] font-medium whitespace-nowrap">{t.name}</span>
    </li>
  );
}

/** Slow, endless logo strip with faded edges. Pauses on hover; static for reduced motion. */
export function ToolsMarquee() {
  return (
    <div
      className="group/marquee relative -mx-6 overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
      }}
      aria-label={`Tools: ${items.map((i) => i.name).join(", ")}`}
      role="img"
    >
      <div className="marquee-track flex w-max gap-3 group-hover/marquee:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 gap-3" aria-hidden={copy === 1}>
            {items.map((t) => (
              <Item key={t.id} t={t} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
