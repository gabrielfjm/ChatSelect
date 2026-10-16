import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/layout/container";

export function SiteFooter() {
  return (
    <footer className="bg-[#0F172A]">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_0.6fr_0.8fr]">
        <div className="max-w-md">
          <div className="mb-4 flex items-center gap-3">
            <BrandMark decorative className="size-9" />
            <span className="font-serif text-lg font-bold text-white">
              ChatSelect
            </span>
          </div>
          <p className="text-sm leading-relaxed text-blue-200">
            Catálogo científico para apoiar a escolha de instrumentos de
            avaliação de chatbots educacionais.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-blue-200 uppercase">
            Navegação
          </p>
          <div className="flex flex-col gap-2 text-sm text-blue-200">
            <Link href="/instrumentos" className="hover:text-white">
              Catálogo
            </Link>
            <Link href="/ad-hoc" className="hover:text-white">
              Ad Hoc
            </Link>
            <Link href="/solicitar" className="hover:text-white">
              Solicitar instrumento
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-blue-200 uppercase">
            Pesquisa
          </p>
          <p className="text-sm leading-relaxed text-blue-200">
            Dados extraídos de estudos científicos e revisados manualmente.
          </p>
          <a
            href="/assets/artigo-chatselect.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-blue-200"
          >
            Ler o artigo
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-blue-200 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 ChatSelect</p>
        <p>
          Pesquisa aberta, seleção mais fundamentada. ·{" "}
          <Link href="/admin" className="hover:text-white">
            Área do administrador
          </Link>
        </p>
      </Container>
    </footer>
  );
}
