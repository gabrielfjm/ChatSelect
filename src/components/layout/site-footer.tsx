import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/layout/container";
import { withBasePath } from "@/lib/base-path";

export function SiteFooter() {
  return (
    <footer className="border-t border-cyan-300/10 bg-[#030916]">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_0.6fr_0.8fr]">
        <div className="max-w-md">
          <div className="mb-4 flex items-center gap-3">
            <BrandMark decorative className="size-9 rounded-xl" />
            <span className="font-serif text-lg font-bold text-white">
              Chat<span className="text-cyan-400">Select</span>
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Catálogo científico para apoiar a escolha de instrumentos de
            avaliação de chatbots educacionais.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
            Navegação
          </p>
          <div className="text-muted-foreground flex flex-col gap-2 text-sm">
            <Link href="/instrumentos" className="hover:text-cyan-300">
              Catálogo
            </Link>
            <Link href="/ad-hoc" className="hover:text-cyan-300">
              Instrumentos Ad Hoc
            </Link>
            <Link href="/solicitar" className="hover:text-cyan-300">
              Sugerir instrumento
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
            Pesquisa
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Dados extraídos de estudos científicos e revisados manualmente.
          </p>
          <a
            href={withBasePath("/assets/artigo-chatselect.pdf")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Ler o artigo
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </Container>
      <Container className="text-muted-foreground flex flex-col gap-2 border-t border-cyan-300/10 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 ChatSelect</p>
        <p>Pesquisa aberta, seleção mais fundamentada.</p>
      </Container>
    </footer>
  );
}
