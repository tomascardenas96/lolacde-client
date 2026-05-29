import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "../layout/Logo";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogue" },
  { label: "Servicios", href: "/services" },
  { label: "Contacto", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-background relative overflow-hidden">
      {/* Decorative gold line */}
      <div className="px-6 md:px-20 lg:px-32">
        <div className="h-px bg-linear-to-r from-transparent via-accent/40 to-transparent" />
      </div>

      {/* Info grid — asymmetric editorial layout */}
      <div className="px-6 md:px-24 lg:px-32 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Navigation */}
          <div className="py-12 pr-8 border-b lg:border-b-0 lg:border-r border-white/5">
            <p className="text-[0.55rem] tracking-[0.3em] text-accent uppercase mb-6">
              Navegación
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-[0.8rem] text-muted hover:text-white transition-colors duration-300"
                  >
                    <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="py-12 lg:px-8 border-b lg:border-b-0 lg:border-r border-white/5">
            <p className="text-[0.55rem] tracking-[0.3em] text-accent uppercase mb-6">
              Visitanos
            </p>
            <p className="text-[0.8rem] text-muted leading-relaxed">
              Av. Santa Fe 1234, Piso 2
            </p>
            <p className="text-[0.8rem] text-muted/60 mt-1">Palermo, CABA</p>
            <div className="w-8 h-px bg-white/10 my-5" />
            <p className="text-[0.8rem] text-muted leading-relaxed">
              Lun a Vie — 9:00 a 20:00
            </p>
            <p className="text-[0.8rem] text-muted/60 mt-1">
              Sábados — 9:00 a 14:00
            </p>
          </div>

          {/* Contact */}
          <div className="py-12 lg:px-8 border-b lg:border-b-0 lg:border-r border-white/5">
            <p className="text-[0.55rem] tracking-[0.3em] text-accent uppercase mb-6">
              Contacto
            </p>
            <a
              href="tel:+541145678900"
              className="block text-[0.8rem] text-muted hover:text-white transition-colors duration-300"
            >
              +54 11 4567-8900
            </a>
            <a
              href="mailto:hola@lola.com.ar"
              className="block text-[0.8rem] text-muted hover:text-white transition-colors duration-300 mt-2"
            >
              hola@lola.com.ar
            </a>
            <div className="w-8 h-px bg-white/10 my-5" />
            <a
              href="https://wa.me/5492281576513"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[0.8rem] text-white hover:text-accent transition-colors duration-300"
            >
              WhatsApp
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </a>
          </div>

          {/* Social */}
          <div className="py-12 lg:pl-8">
            <p className="text-[0.55rem] tracking-[0.3em] text-accent uppercase mb-6">
              Seguinos
            </p>
            {[
              { label: "Instagram", href: "#" },
              { label: "Pinterest", href: "#" },
              { label: "Facebook", href: "#" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="group flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 text-[0.8rem] text-muted hover:text-white transition-colors duration-300"
              >
                {social.label}
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="px-6 md:px-20 lg:px-32 py-6 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted/40 tracking-widest">
            &copy; {new Date().getFullYear()} Lola Centro de Estética
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[10px] tracking-widest text-muted/40 hover:text-muted transition-colors duration-300"
            >
              Privacidad
            </a>
            <span className="text-muted/20 text-[10px]">/</span>
            <a
              href="#"
              className="text-[10px] tracking-widest text-muted/40 hover:text-muted transition-colors duration-300"
            >
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
