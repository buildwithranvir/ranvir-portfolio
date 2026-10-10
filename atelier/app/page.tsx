import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Crosshair } from "@/components/motion/Crosshair";
import { Intro } from "@/components/motion/Intro";
import { PageMotion } from "@/components/motion/PageMotion";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Contact } from "@/components/sections/Contact";
import { Details } from "@/components/sections/Details";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Practice } from "@/components/sections/Practice";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Intro />
      <Crosshair />
      <a href="#main" className="label fixed left-4 top-4 z-[200] -translate-y-24 bg-ink px-5 py-3 text-paper focus:translate-y-0">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Projects />
        <Details />
        <Practice />
        <Philosophy />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <PageMotion />
    </>
  );
}
