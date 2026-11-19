import type { ReactNode } from "react";

/** iPhone-style frame around a 390×844 artboard, scaled to `width` px. */
export function Phone({ children, width = 300, className = "" }: { children: ReactNode; width?: number; className?: string }) {
  const bezel = 12;
  const outerW = 390 + bezel * 2;
  const outerH = 844 + bezel * 2;
  const scale = width / outerW;
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width, height: outerH * scale }}>
      <div
        className="absolute top-0 left-0 origin-top-left rounded-[64px] bg-[#0d0d0f] shadow-[0_30px_60px_-24px_rgba(0,0,0,.45),inset_0_0_0_2px_#2a2a2e]"
        style={{ width: outerW, height: outerH, padding: bezel, transform: `scale(${scale})` }}
      >
        <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[52px] bg-white">
          {children}
          {/* dynamic island */}
          <span className="pointer-events-none absolute top-[11px] left-1/2 z-50 h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black" />
          {/* home indicator */}
          <span className="pointer-events-none absolute bottom-2 left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black/80" />
        </div>
      </div>
    </div>
  );
}
