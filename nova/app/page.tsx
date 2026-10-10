import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PageMotion } from "@/components/motion/PageMotion";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";
import { Proof } from "@/components/sections/Proof";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <a href="#main" className="mono fixed left-4 top-4 z-[200] -translate-y-24 rounded-md bg-signal px-4 py-3 text-void focus:translate-y-0">
        skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <Capabilities />
        <Method />
        <Proof />
        <Contact />
      </main>
      <Footer />
      <PageMotion />
    </>
  );
}
