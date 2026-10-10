import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { QuickView } from "@/components/QuickView";
import { ShopProvider } from "@/components/ShopContext";
import { Cursor } from "@/components/motion/Cursor";
import { Intro } from "@/components/motion/Intro";
import { PageMotion } from "@/components/motion/PageMotion";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Edit } from "@/components/sections/Edit";
import { Hero } from "@/components/sections/Hero";
import { Issues } from "@/components/sections/Issues";
import { Letter } from "@/components/sections/Letter";
import { Lookbook } from "@/components/sections/Lookbook";
import { Studio } from "@/components/sections/Studio";
import { Subscribe } from "@/components/sections/Subscribe";

export default function Home() {
  return (
    <ShopProvider>
      <SmoothScroll />
      <Intro />
      <Cursor />
      <a href="#main" className="mono fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-acid px-5 py-3 text-ink focus:translate-y-0">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Studio />
        <Letter />
        <Lookbook />
        <Edit />
        <Issues />
        <Subscribe />
      </main>
      <Footer />
      <QuickView />
      {/* Last, so its colour triggers are measured after every pinned section above */}
      <PageMotion />
    </ShopProvider>
  );
}
