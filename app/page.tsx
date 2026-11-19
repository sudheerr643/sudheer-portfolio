import Image from "next/image";
import { AboutSheet } from "@/components/AboutSheet";
import { EjoyMedia, PayinstacardMedia, ProjectCard, SplitPayMedia } from "@/components/projects";
import { Hero } from "@/components/Hero";
import { InterestsCard } from "@/components/InterestsCard";
import { LocationTile } from "@/components/LocationTile";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { GlassButton, Icon, Tile } from "@/components/ui";
import { Clock, ExperienceRuler, ThemeToggle } from "@/components/widgets";
import { profile } from "@/lib/content";

const EJOY_URL =
  "https://www.figma.com/proto/vbokbwrcd7QvtbX3JZg3eD/Ejoy-Shop---UX-Case-Study?node-id=10-2352&viewport=828%2C209%2C0.03&t=XpspKQBMoxGgjS1K-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1";

/*
 * Bento grid modelled on the reference: three equal columns and a fixed 32px gap.
 * On desktop the three columns always end level: the "More case studies" card (left)
 * and the Payinstacard card (right) stretch to match the middle column's height.
 */
export default function Home() {
  return (
    <>
      <main className="px-[var(--gap)] py-6">
        <div className="grid grid-cols-1 gap-[var(--gap)] md:grid-cols-2 lg:grid-cols-3">
          {/* ---------- Center column (first on mobile) ---------- */}
          <section className="flex flex-col md:col-span-2 lg:order-2 lg:col-span-1">
            <div className="grid grid-cols-2 gap-[var(--gap)]">
              {/* About me */}
              <Tile i={0} className="h-[180px] !p-0 lg:h-[208px]">
                <a href="#about" className="group flex h-full flex-col gap-3 p-4 pt-5">
                  <span className="px-1 text-[20px] font-semibold tracking-[-0.02em]">About me</span>
                  {/* 16:9 photo frame filling the card width */}
                  <span className="relative mt-auto aspect-video w-full overflow-hidden rounded-[20px] bg-chip">
                    <Image
                      src="/assets/profile.jpg"
                      alt="Sudheer in the mountains of Ladakh"
                      fill
                      priority
                      quality={90}
                      sizes="(min-width: 1024px) 400px, 50vw"
                      className="object-cover object-[70%_30%] transition-transform duration-700 ease-[cubic-bezier(.25,1,.5,1)] group-hover:scale-105"
                    />
                  </span>
                </a>
              </Tile>
              {/* Location */}
              <Tile i={1} className="h-[180px] lg:h-[208px]">
                <LocationTile />
              </Tile>
            </div>

            <Hero />

            <div className="mt-[var(--gap)] flex flex-col gap-[var(--gap)]">
              {/* Open to work — reference: dark coaching bar */}
              <Tile i={8} className="!rounded-full !bg-[#121212] !py-3 !pr-3 !pl-3 text-white dark:!bg-[#1f1f1f]">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#3ddc84]/15 text-[#3ddc84]">
                    <Icon.briefcase className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="flex items-center gap-1.5 text-[12px] text-white/60">
                      <span className="live-dot size-1.5 rounded-full bg-[#3ddc84]" /> Available now
                    </p>
                    <p className="truncate text-[15px] font-semibold">Open to new design roles</p>
                  </div>
                  <GlassButton green size="sm" href={`mailto:${profile.email}`}>
                    <Icon.mail className="size-4" />
                    Say hi
                  </GlassButton>
                </div>
              </Tile>

              {/* Stack — reference: video feedback card */}
              <Tile i={9}>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#e8f0fe] px-2 py-0.5 text-[12px] font-medium text-[#1a73e8] dark:bg-[#1a73e8]/20 dark:text-[#8ab4f8]">
                      <Icon.sparkle className="size-3" /> My stack
                    </span>
                    <p className="mt-3 text-[20px] leading-tight font-semibold tracking-[-0.02em]">Tools I think in</p>
                  </div>
                  <GlassButton size="sm" href="#about" className="shrink-0">
                    About me
                  </GlassButton>
                </div>
                <div className="mt-5">
                  <ToolsMarquee />
                </div>
              </Tile>

              {/* Interests — reference: guide card with image left */}
              <Tile i={10} className="!p-0">
                <InterestsCard />
              </Tile>
            </div>
          </section>

          {/* ---------- Left column ---------- */}
          <section className="flex flex-col gap-[var(--gap)] lg:order-1">
            <ProjectCard
              i={3}
              className="h-[520px] lg:h-[600px]"
              href={EJOY_URL}
              external
              status="Case study"
              title="Ejoy Shop"
              subtitle="Video-first live shopping with local boutiques, from anywhere"
              media={<EjoyMedia />}
            />
            <ProjectCard
              i={5}
              className="h-[420px] lg:h-auto lg:min-h-[440px] lg:flex-1"
              href="/split-pay"
              status="Concept"
              tone="blue"
              title="Split Pay for group bookings"
              subtitle="Book together, pay separately — a feature concept for movie ticketing"
              media={<SplitPayMedia />}
            />
          </section>

          {/* ---------- Right column ---------- */}
          <section className="flex flex-col gap-[var(--gap)] lg:order-3">
            <Tile i={2} className="h-[120px] lg:h-[140px]">
              <ThemeToggle />
            </Tile>
            <ProjectCard
              i={4}
              className="h-[380px] lg:h-auto lg:min-h-[432px] lg:flex-1"
              href="/payinstacard"
              variant="dark"
              status="Shipped"
              title="Payinstacard Rental Payments"
              subtitle="Cut desktop dependency from 70% to 45% with a guided, high-trust flow"
              media={<PayinstacardMedia />}
            />
            <Tile i={6} className="flex min-h-[204px] flex-col justify-center">
              <ExperienceRuler />
            </Tile>
            <Tile i={7} className="flex min-h-[200px] flex-col justify-center">
              <Clock />
            </Tile>
          </section>
        </div>

        <footer className="mt-16 flex flex-col items-center gap-4 pb-4 text-center">
          <div className="flex gap-3">
            <GlassButton size="icon" href={profile.linkedin} external label="LinkedIn">
              <Icon.linkedin className="size-4" />
            </GlassButton>
            <GlassButton size="icon" href={profile.instagram} external label="Instagram">
              <Icon.instagram className="size-4" />
            </GlassButton>
          </div>
          <p className="text-[13px] text-muted">
            © {new Date().getFullYear()} {profile.fullName}. {profile.role}.
          </p>
        </footer>
      </main>
      <AboutSheet />
    </>
  );
}
