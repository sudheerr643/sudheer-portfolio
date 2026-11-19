import { notFound } from "next/navigation";
import { Screen } from "@/components/splitpay/screens";
import { screenOrder, type ScreenId } from "@/lib/splitpay/screenMeta";

// Bare 390×844 artboards — used to export PNGs of each screen.
export function generateStaticParams() {
  return screenOrder.map((id) => ({ id }));
}

export const metadata = { robots: { index: false } };

export default async function ScreenExport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!screenOrder.includes(id as ScreenId)) notFound();
  return (
    <div className="h-[844px] w-[390px] overflow-hidden">
      <Screen id={id as ScreenId} />
    </div>
  );
}
