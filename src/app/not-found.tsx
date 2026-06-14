import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.65rem] tracking-[0.35em] text-accent uppercase mb-6">
        Error 404
      </p>
      <h1 className="heading-display text-6xl md:text-8xl text-white mb-6">
        PAGINA NO <br /> ENCONTRADA
      </h1>
      <p className="text-sm text-muted max-w-sm leading-relaxed mb-10">
        La pagina que buscas no existe o fue movida. Volvé al inicio o explorá
        nuestro catalogo.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-block bg-white text-black px-10 py-4 text-[0.65rem] tracking-[0.2em] uppercase font-semibold hover:bg-transparent hover:text-white border border-white transition-all"
        >
          Volver al inicio
        </Link>
        <Link
          href="/catalogue"
          className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:border-white/50 transition-all"
        >
          Ver catalogo
        </Link>
      </div>
    </main>
  );
}
