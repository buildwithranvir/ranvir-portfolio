import { CursorRing } from "@/components/CursorRing";
import { Deck } from "@/components/Deck";
import { Finale } from "@/components/Finale";
import { Flood } from "@/components/Flood";
import { Hero } from "@/components/Hero";
import { Hud } from "@/components/Hud";
import { LiveProvider } from "@/components/LiveViewer";
import { Loader } from "@/components/Loader";
import { Room } from "@/components/Room";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Steps } from "@/components/Steps";
import { TopBar } from "@/components/TopBar";
import { templates } from "@/lib/templates";

/** Ranvir's Templates: a paint shop where every template is a colour. */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <a href="#deck" className="mono fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-ink px-5 py-3 text-card focus:translate-y-0">
        Skip to the templates
      </a>
      <TopBar />
      <Flood />
      <LiveProvider>
        <main id="main" className="relative z-[1]">
          <Hero />
          <Steps />
          <Deck />
          {templates.map((t, i) => (
            <Room key={t.id} t={t} index={i} />
          ))}
          <Finale />
        </main>
      </LiveProvider>
      <Hud />
      <CursorRing />
      <div aria-hidden className="grain" />
    </>
  );
}
