import { Phone } from "@/components/splitpay/Phone";
import { Screen } from "@/components/splitpay/screens";

// Large render of the Split Pay card artwork, used to export thumbnail PNGs.
// /split-pay/thumbnail?w=1600&h=1200
export const metadata = { robots: { index: false } };

export default async function Thumbnail({ searchParams }: { searchParams: Promise<{ w?: string; h?: string }> }) {
  const sp = await searchParams;
  const w = Number(sp.w) || 1600;
  const h = Number(sp.h) || 1200;
  // size the phones from the shorter side so both formats stay balanced
  const big = Math.round(Math.min(h * 0.38, w * 0.27));
  const small = Math.round(big * 0.88);

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: w, height: h, background: "radial-gradient(120% 90% at 50% 0%, #FFE3E8 0%, #FFF5F6 45%, #FFFFFF 100%)" }}
    >
      <div className="absolute inset-0 flex items-center justify-center" style={{ gap: big * 0.12 }}>
        <div style={{ marginTop: big * 0.35, transform: "rotate(-4deg)" }}>
          <Phone width={small}>
            <Screen id="f1-invite" />
          </Phone>
        </div>
        <div style={{ transform: "rotate(3deg)" }}>
          <Phone width={big}>
            <Screen id="s3-status" />
          </Phone>
        </div>
      </div>
    </div>
  );
}
