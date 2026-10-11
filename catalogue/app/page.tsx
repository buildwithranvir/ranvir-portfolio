import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { How } from "@/components/How";
import { Index } from "@/components/Index";
import { LiveProvider } from "@/components/LiveViewer";
import { Loader } from "@/components/Loader";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Template } from "@/components/Template";
import { templates } from "@/lib/templates";

/** Ranvir's Templates: ready-made website designs, shown properly. */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <a href="#templates" className="label fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-fg px-5 py-3 text-bg focus:translate-y-0">
        Skip to the templates
      </a>
      <Nav />
      <LiveProvider>
        <main id="main">
          <Hero />
          <Marquee />
          <Index />
          {templates.map((t, i) => (
            <Template key={t.id} t={t} index={i} />
          ))}
          <How />
          <Contact />
        </main>
      </LiveProvider>
    </>
  );
}
