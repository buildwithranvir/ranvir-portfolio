import { Chrome } from "@/components/cine/Chrome";
import { Intro } from "@/components/cine/Intro";
import { Viewfinder } from "@/components/cine/Viewfinder";
import { Marks } from "@/components/motion/Marks";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { About } from "@/components/scenes/About";
import { Craft } from "@/components/scenes/Craft";
import { Credits } from "@/components/scenes/Credits";
import { Hero } from "@/components/scenes/Hero";
import { Kit } from "@/components/scenes/Kit";
import { Method } from "@/components/scenes/Method";
import { Offscreen } from "@/components/scenes/Offscreen";
import { Projects } from "@/components/scenes/Projects";

/** Ranvir Kawatra — portfolio. */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Marks />
      <a href="#main" className="hud fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-tungsten px-5 py-3 text-void focus:translate-y-0">
        Skip to content
      </a>
      <Intro />
      <Chrome />
      <main id="main">
        <Hero />
        <About />
        <Craft />
        <Projects />
        <Offscreen />
        <Kit />
        <Method />
        <Credits />
      </main>
      <Viewfinder />
      <div aria-hidden className="grain" />
    </>
  );
}
