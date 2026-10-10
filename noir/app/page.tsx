import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Cursor } from "@/components/motion/Cursor";
import { Intro } from "@/components/motion/Intro";
import { Panels } from "@/components/motion/Panels";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SectionRail } from "@/components/SectionRail";
import { Beans } from "@/components/sections/Beans";
import { Book } from "@/components/sections/Book";
import { Day } from "@/components/sections/Day";
import { Hero } from "@/components/sections/Hero";
import { Menu } from "@/components/sections/Menu";
import { Room } from "@/components/sections/Room";
import { Ticker } from "@/components/sections/Ticker";
import { Visit } from "@/components/sections/Visit";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Intro />
      <Panels />
      <Cursor />
      <a href="#main" className="fixed left-4 top-4 z-[200] -translate-y-24 bg-ink px-5 py-3 text-sm text-milk focus:translate-y-0">
        Skip to content
      </a>
      <Nav />
      <SectionRail />
      <main id="main">
        <Hero />
        <Ticker />
        <Day />
        <Beans />
        <Menu />
        <Room />
        <Visit />
        <Book />
      </main>
      <Footer />
    </>
  );
}
