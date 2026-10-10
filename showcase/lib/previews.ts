// Real screenshots of each demo, captured from the running sites.
// Re-capture after changing a demo so the showcase stays truthful.
import type { StaticImageData } from "next/image";
import noirDesktop from "@/public/previews/noir-desktop.jpg";
import noirSection from "@/public/previews/noir-section.jpg";
import noirMobile from "@/public/previews/noir-mobile.jpg";
import noirT1 from "@/public/previews/tour/noir-1.jpg";
import noirT2 from "@/public/previews/tour/noir-2.jpg";
import noirT3 from "@/public/previews/tour/noir-3.jpg";
import noirT4 from "@/public/previews/tour/noir-4.jpg";
import noirT5 from "@/public/previews/tour/noir-5.jpg";
import vantaDesktop from "@/public/previews/vanta-desktop.jpg";
import vantaSection from "@/public/previews/vanta-section.jpg";
import vantaMobile from "@/public/previews/vanta-mobile.jpg";
import vantaT1 from "@/public/previews/tour/vanta-1.jpg";
import vantaT2 from "@/public/previews/tour/vanta-2.jpg";
import vantaT3 from "@/public/previews/tour/vanta-3.jpg";
import vantaT4 from "@/public/previews/tour/vanta-4.jpg";
import vantaT5 from "@/public/previews/tour/vanta-5.jpg";
import atelierDesktop from "@/public/previews/atelier-desktop.jpg";
import atelierSection from "@/public/previews/atelier-section.jpg";
import atelierMobile from "@/public/previews/atelier-mobile.jpg";
import atelierT1 from "@/public/previews/tour/atelier-1.jpg";
import atelierT2 from "@/public/previews/tour/atelier-2.jpg";
import atelierT3 from "@/public/previews/tour/atelier-3.jpg";
import atelierT4 from "@/public/previews/tour/atelier-4.jpg";
import atelierT5 from "@/public/previews/tour/atelier-5.jpg";
import novaDesktop from "@/public/previews/nova-desktop.jpg";
import novaSection from "@/public/previews/nova-section.jpg";
import novaMobile from "@/public/previews/nova-mobile.jpg";
import novaT1 from "@/public/previews/tour/nova-1.jpg";
import novaT2 from "@/public/previews/tour/nova-2.jpg";
import novaT3 from "@/public/previews/tour/nova-3.jpg";
import novaT4 from "@/public/previews/tour/nova-4.jpg";
import novaT5 from "@/public/previews/tour/nova-5.jpg";

export type Preview = { desktop: StaticImageData; section: StaticImageData; mobile: StaticImageData; tour: StaticImageData[] };

export const previews: Record<string, Preview> = {
  noir: { desktop: noirDesktop, section: noirSection, mobile: noirMobile, tour: [noirT1, noirT2, noirT3, noirT4, noirT5] },
  vanta: { desktop: vantaDesktop, section: vantaSection, mobile: vantaMobile, tour: [vantaT1, vantaT2, vantaT3, vantaT4, vantaT5] },
  atelier: { desktop: atelierDesktop, section: atelierSection, mobile: atelierMobile, tour: [atelierT1, atelierT2, atelierT3, atelierT4, atelierT5] },
  nova: { desktop: novaDesktop, section: novaSection, mobile: novaMobile, tour: [novaT1, novaT2, novaT3, novaT4, novaT5] },
};
