import React from "react";
import { ArrowUpRight, Instagram, Mail, MapPin } from "lucide-react";

/**
 * Public marketing page for "Seksjon Foto" — Nasjonalmuseet's photo lab.
 * Styled after the Pravah design tokens (warm parchment canvas, aubergine-black
 * inversion, single-family ABCfavorit Book typography).
 */

const FONT_STACK =
  "'ABCfavorit Book', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

function DiamondGrid({ tone = "ash" }: { tone?: "ink" | "ash" | "white" }) {
  const fill = tone === "white" ? "#ffffff" : tone === "ink" ? "#181011" : "#aaaaaa";
  return (
    <div className="grid grid-cols-3 gap-[3px] w-10 h-10 shrink-0" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="w-[9px] h-[9px] rotate-45"
          style={{ backgroundColor: fill, opacity: i % 2 === 0 ? 1 : 0.4 }}
        />
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-[4px] bg-white px-2 py-0.5 text-[12px] uppercase tracking-[0.1em] text-[#181011]">
      {children}
    </span>
  );
}

function PillButton({
  href,
  children,
  external = false,
  onDark = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  onDark?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center rounded-[100px] border px-5 py-2 text-[15px] transition-colors ${
        onDark
          ? "border-white text-white hover:bg-white/10"
          : "border-[#181011] text-[#181011] hover:bg-[#181011]/5"
      }`}
    >
      {children}
    </a>
  );
}

function FeatureRow({ term, body }: { term: string; body: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-[#d8d4d4] py-5">
      <DiamondGrid tone="ink" />
      <div>
        <h3 className="text-[17px] font-bold text-[#181011]">{term}</h3>
        <p className="mt-1 text-[14px] leading-[1.5] text-[#666666]">{body}</p>
      </div>
    </div>
  );
}

function ServiceCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-[4px] border border-[#d8d4d4] bg-white p-6">
      <DiamondGrid tone="ink" />
      <div>
        <h3 className="text-[20px] font-bold leading-[1.3] text-[#181011]">{title}</h3>
        <p className="mt-2 text-[15px] leading-[1.5] text-[#222222]">{body}</p>
      </div>
    </div>
  );
}

function ProjectCard({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-[4px] border border-white/25 p-6 transition-colors hover:border-white/60 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[20px] font-bold leading-[1.3] text-white">{title}</h3>
        <ArrowUpRight className="w-5 h-5 shrink-0 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>
      <p className="text-[14px] leading-[1.5] text-[#aaaaaa]">{body}</p>
    </a>
  );
}

function ResourceLink({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 rounded-[4px] border border-[#d8d4d4] bg-white px-5 py-4 transition-colors hover:border-[#181011]"
    >
      <span className="text-[15px] text-[#181011]">{title}</span>
      <ArrowUpRight className="w-4 h-4 shrink-0 text-[#666666] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#181011]" />
    </a>
  );
}

// ---------------------------------------------------------------------------
// Hero illustration — a thin-line "capture grid" schematic standing in for
// photography, in place of stock imagery the brand guide explicitly avoids.
// ---------------------------------------------------------------------------

function CaptureGridIllustration() {
  const cols = 12;
  const rows = 8;
  const cell = 28;
  const captured = new Set([
    "2-1", "3-1", "4-1", "2-2", "3-2", "4-2", "5-2", "3-3", "4-3", "5-3", "6-3",
    "4-4", "5-4", "6-4", "7-4", "5-5", "6-5", "7-5", "8-5", "6-6", "7-6",
  ]);

  return (
    <svg
      viewBox={`0 0 ${cols * cell} ${rows * cell}`}
      className="h-auto w-full"
      role="img"
      aria-label="Skjematisk rutenett som illustrerer et gigapixel-opptak"
    >
      <rect x="0" y="0" width={cols * cell} height={rows * cell} fill="#ffffff" />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const key = `${c}-${r}`;
          const isCaptured = captured.has(key);
          return (
            <rect
              key={key}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill={isCaptured ? "#181011" : "none"}
              fillOpacity={isCaptured ? 0.06 : 1}
              stroke="#181011"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          );
        })
      )}
      <path
        d={`M ${2 * cell} ${1 * cell} L ${8 * cell} ${5 * cell} L ${7 * cell} ${6 * cell}`}
        fill="none"
        stroke="#181011"
        strokeOpacity={0.5}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
    </svg>
  );
}

function CaptureGridPanel() {
  return (
    <div className="relative rounded-[4px] border border-[#181011]/15 bg-white p-3">
      <CaptureGridIllustration />
      <div className="absolute bottom-4 left-4 max-w-[240px] rounded-[4px] border border-[#d8d4d4] bg-white/95 px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-sm">
        <p className="text-[14px] font-bold text-[#181011]">Gigapixelbilder</p>
        <p className="mt-1 text-[12px] leading-[1.5] text-[#666666]">
          1000–1500 næropptak satt sammen til ekstremt høyoppløselige filer.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function Nav() {
  return (
    <header className="border-b border-[#d8d4d4]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <span className="h-2.5 w-2.5 rotate-45 bg-[#181011]" aria-hidden="true" />
          <span className="text-[15px] font-bold text-[#181011]">Nasjonalmuseet Foto</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#top" className="text-[14px] text-[#181011] transition-opacity hover:opacity-60">
            Hjem
          </a>
          <a href="#experiments" className="text-[14px] text-[#181011] transition-opacity hover:opacity-60">
            Prosjekter
          </a>
          <a href="#links" className="text-[14px] text-[#181011] transition-opacity hover:opacity-60">
            Ressurser
          </a>
        </nav>
        <PillButton href="#">Logg inn</PillButton>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="bg-[#f3f1ed]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-20">
        <div>
          <SectionLabel>Nasjonalmuseet Foto Beta</SectionLabel>
          <h1 className="mt-6 max-w-[520px] text-[40px] uppercase leading-[1.1] tracking-[-0.02em] text-[#181011] md:text-[48px]">
            Fotografi i utvikling
          </h1>
          <p className="mt-6 max-w-[480px] text-[17px] leading-[1.5] text-[#222222]">
            Utforsk grensene for digital dokumentasjon og visuell formidling gjennom våre nyeste
            lab-prosjekter.
          </p>
          <div className="mt-8">
            <PillButton href="#experiments">Utforsk prosjekter</PillButton>
          </div>

          <div className="mt-14 flex flex-col border-t border-[#d8d4d4]">
            <FeatureRow term="Presisjon" body="Sub-millimeter detaljgjengivelse for arkivbruk." />
            <FeatureRow term="Bevaring" body="Digital sikring av sårbare objekter." />
          </div>
        </div>

        <CaptureGridPanel />
      </div>
    </section>
  );
}

const SERVICES = [
  {
    title: "Fotografering og digitalisering",
    body: "Høyoppløselig fotografering av kunstverk og detaljbilder.",
  },
  {
    title: "Dokumentasjon av utstillinger",
    body: "Fotografering av midlertidige og faste utstillinger.",
  },
  {
    title: "Teknisk vitenskapelig fotografering",
    body: "Pålys, sidelys, ultrafiolett, infrarød og røntgen.",
  },
  {
    title: "Bildearkiv & Byrå",
    body: "Bildearkiv på over 200 000 bilder og distribusjon til ulike målgrupper.",
  },
];

function Services() {
  return (
    <section id="om-oss" className="border-t border-[#d8d4d4] bg-[#f3f1ed]">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <SectionLabel>Våre tjenester</SectionLabel>
        <h2 className="mt-6 max-w-[640px] text-[32px] leading-[1.2] tracking-[-0.02em] text-[#181011] md:text-[40px]">
          Seksjon Foto
        </h2>
        <p className="mt-4 max-w-[640px] text-[17px] leading-[1.5] text-[#222222]">
          Velkommen til Nasjonalmuseet Foto sin beta-side. Her viser vi frem eksperimenter,
          pågående prosjekter og gir et innblikk i hvordan vi digitaliserer og bevarer Norges
          kunstskatter.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} title={s.title} body={s.body} />
          ))}
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    title: "Gigapixelbilder",
    body: "Motorisert staffeli og 1000–1500 næropptak satt sammen til ekstremt høyoppløselige filer.",
    href: "https://namfoto.no/osd/gigapixel/",
  },
  {
    title: "SHARP - Gaussian Splat",
    body: "3D Gaussian Splatting og nevralt nettverk.",
    href: "https://namfoto.no/3d/gaussian_splat/sharp/",
  },
  {
    title: "Gaussian Splat",
    body: "Sanntids-rendering basert på millioner av overlappende ellipser.",
    href: "https://namfoto.no/3d/gaussian_splat/eksempel/",
  },
  {
    title: "360° fotografering av drakter",
    body: "75 opptak på roterende plate og interaktiv modell.",
    href: "https://www.nasjonalmuseet.no/samlingen/tema/opplev-drakter-fra-samlingen-i-360/",
  },
  {
    title: "3D fotogrammetri og skanning",
    body: "Digitalisering av skulpturer og gjenstander.",
    href: "https://namfoto.no/3d/",
  },
  {
    title: "Virtuelle visninger (Matterport)",
    body: "Dokumentasjon av utstillinger i 3D.",
    href: "https://discover.matterport.com/account/MnXCJAxyeFB",
  },
];

function Projects() {
  return (
    <section id="experiments" className="bg-[#302023]">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <SectionLabel>Fremtidens formidling</SectionLabel>
        <h2 className="mt-6 max-w-[640px] text-[32px] leading-[1.2] tracking-[-0.02em] text-white md:text-[40px]">
          Det Digitale Museet
        </h2>
        <p className="mt-4 max-w-[640px] text-[17px] leading-[1.5] text-[#aaaaaa]">
          Gjennom innovativ teknologi gjør vi samlingen tilgjengelig på helt nye måter –
          uavhengig av tid og sted.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}

const RESOURCES = [
  { title: "Utskriftsguide", href: "https://www.namfoto.no/utskriftsguide/" },
  { title: "SHARP - Gaussian splat", href: "https://namfoto.no/3d/gaussian_splat/sharp/" },
  { title: "Puslespill", href: "https://namfoto.no/puslespill/brudeferd/brudeferd-v4.html" },
  { title: "PPI Kalkulator", href: "https://namfoto.no/ppi/" },
  { title: "Butterfly Tools", href: "https://www.namfoto.no/butterfly/butterfly_tools.html" },
  { title: "Open Sea Dragon prosjekter", href: "https://namfoto.no/osd/" },
  { title: "Gigapixel", href: "https://namfoto.no/gigapixel/" },
  { title: "MetaView – Metadata-inspektor", href: "https://www.namfoto.no/fildata/" },
  { title: "Metadatahåndbok", href: "https://www.namfoto.no/metadataguide/" },
  { title: "Emneord-generator", href: "https://namfoto.no/metadata/emneord.html" },
  { title: "RTI", href: "https://namfoto.no/rti/" },
  { title: "Plakatmal for NaM", href: "https://www.namfoto.no/plakatmal/" },
  { title: "Utskriftskalkulator", href: "https://namfoto.no/utskriftskalkulator/" },
];

function Resources() {
  return (
    <section id="links" className="border-t border-[#d8d4d4] bg-[#f3f1ed]">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <SectionLabel>Ressursbank</SectionLabel>
        <h2 className="mt-6 max-w-[640px] text-[32px] leading-[1.2] tracking-[-0.02em] text-[#181011] md:text-[40px]">
          Verktøy &amp; Dokumentasjon
        </h2>
        <p className="mt-4 max-w-[640px] text-[17px] leading-[1.5] text-[#222222]">
          Finn tekniske guider, metadata-verktøy og dokumentasjon for digitaliseringsarbeidet.
        </p>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <ResourceLink key={r.title} title={r.title} href={r.href} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialSection() {
  return (
    <section className="border-t border-[#d8d4d4] bg-[#f3f1ed]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
        <div>
          <SectionLabel>Sosiale medier</SectionLabel>
          <h2 className="mt-6 text-[28px] leading-[1.3] tracking-[-0.02em] text-[#181011] md:text-[32px]">
            Følg Nasjonalmuseet på Instagram
          </h2>
          <p className="mt-4 max-w-[480px] text-[17px] leading-[1.5] text-[#222222]">
            Få et innblikk i hverdagen på museet og se våre nyeste digitaliseringsprosjekter.
          </p>
          <div className="mt-8">
            <PillButton href="https://www.instagram.com/nasjonalmuseet/" external>
              Se profil
            </PillButton>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-[4px] border border-[#d8d4d4] bg-white/70 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-[#181011]">
            <Instagram className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-[#181011]">@nasjonalmuseet</p>
            <p className="mt-0.5 text-[13px] text-[#666666]">Instagram</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#181011] text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rotate-45 bg-white" aria-hidden="true" />
              <span className="text-[15px] font-bold text-white">Nasjonalmuseet Foto</span>
            </div>
            <p className="max-w-[320px] text-[14px] leading-[1.5] text-[#aaaaaa]">
              Nasjonalmuseets fotolaboratorium utforsker grensene for digital dokumentasjon og
              visuell formidling.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-[12px] uppercase tracking-[0.1em] text-[#aaaaaa]">
              Utforsk
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#experiments" className="text-[14px] text-white transition-opacity hover:opacity-70">
                  Prosjekter
                </a>
              </li>
              <li>
                <a href="#links" className="text-[14px] text-white transition-opacity hover:opacity-70">
                  Ressurser
                </a>
              </li>
              <li>
                <a href="#om-oss" className="text-[14px] text-white transition-opacity hover:opacity-70">
                  Om oss
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[12px] uppercase tracking-[0.1em] text-[#aaaaaa]">
              Kontakt
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#aaaaaa]" />
                <a
                  href="mailto:photo@nasjonalmuseet.no"
                  className="text-[14px] text-white transition-opacity hover:opacity-70"
                >
                  photo@nasjonalmuseet.no
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#aaaaaa]" />
                <span className="text-[14px] text-white">Brynjulf Bulls plass 3, Oslo</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-6">
          <p className="text-[12px] text-[#aaaaaa]">
            © 2026 Nasjonalmuseet Foto. Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------

export default function App() {
  return (
    <div className="min-h-screen" style={{ fontFamily: FONT_STACK, fontFeatureSettings: '"ss04" 1, "ss11" 1' }}>
      <Nav />
      <Hero />
      <Services />
      <Projects />
      <Resources />
      <SocialSection />
      <Footer />
    </div>
  );
}
