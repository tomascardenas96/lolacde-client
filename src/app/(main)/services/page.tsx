import Link from "next/link";
import { CategoryNav } from "./CategoryNav";
import {
  Scissors,
  Hand,
  Sparkles,
  Eye,
  Flower2,
  Brush,
  ArrowUpRight,
} from "lucide-react";

type Service = {
  name: string;
  description: string;
  duration?: string;
};

type Category = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  Icon: typeof Scissors;
  services: Service[];
};

const categories: Category[] = [
  {
    id: "cabello",
    eyebrow: "Cabello",
    title: "Peluquería & Color",
    intro:
      "Cortes, color y tratamientos pensados para realzar tu identidad sin forzarla.",
    Icon: Scissors,
    services: [
      {
        name: "Corte unisex",
        description: "Diseño a medida según tu estructura y estilo.",
        duration: "45 min",
      },
      {
        name: "Brushing y peinados",
        description: "Acabados pulidos para cada ocasión.",
        duration: "30 min",
      },
      {
        name: "Coloración total / retoque",
        description: "Color uniforme, brillante y de larga duración.",
        duration: "90 min",
      },
      {
        name: "Mechas, balayage y babylights",
        description:
          "Técnicas avanzadas para iluminar tu cabello con naturalidad.",
        duration: "2 a 3 hs",
      },
      {
        name: "Baño de color y matización",
        description: "Refresca tono y elimina reflejos no deseados.",
        duration: "60 min",
      },
      {
        name: "Botox capilar / hidratación profunda",
        description: "Restaura fibra, suavidad y brillo.",
        duration: "75 min",
      },
      {
        name: "Alisado progresivo / keratina",
        description: "Reduce el frizz y aporta movimiento sedoso.",
        duration: "3 hs",
      },
      {
        name: "Tratamiento de puntas",
        description: "Reconstrucción y sellado para cabello dañado.",
        duration: "45 min",
      },
    ],
  },
  {
    id: "unas",
    eyebrow: "Uñas",
    title: "Manos y Pies",
    intro:
      "Manos y pies cuidados al detalle, con esmaltes y materiales de primera línea.",
    Icon: Hand,
    services: [
      {
        name: "Manicuría tradicional",
        description: "Limado, cutículas y esmaltado clásico.",
        duration: "45 min",
      },
      {
        name: "Esmaltado semipermanente",
        description: "Hasta 21 días de color impecable.",
        duration: "60 min",
      },
      {
        name: "Uñas esculpidas en gel",
        description: "Extensión y modelado a medida.",
        duration: "90 min",
      },
      {
        name: "Nail art",
        description: "Diseños personalizados y detalles únicos.",
        duration: "+30 min",
      },
      {
        name: "Pedicuría spa",
        description: "Exfoliación, hidratación y esmaltado.",
        duration: "60 min",
      },
      {
        name: "Retiro y cuidado de cutículas",
        description: "Mantenimiento entre sesiones.",
        duration: "30 min",
      },
    ],
  },
  {
    id: "rostro",
    eyebrow: "Rostro",
    title: "Tratamientos Faciales",
    intro: "Tratamientos faciales que combinan ciencia, ritual y descanso.",
    Icon: Sparkles,
    services: [
      {
        name: "Limpieza facial profunda",
        description: "Renueva la piel y desobstruye los poros.",
        duration: "60 min",
      },
      {
        name: "Hidratación y dermolimpieza",
        description: "Devuelve luminosidad y equilibrio.",
        duration: "60 min",
      },
      {
        name: "Peeling químico",
        description: "Renovación celular para una piel uniforme.",
        duration: "45 min",
      },
      {
        name: "Microdermoabrasión",
        description: "Exfoliación profunda con punta de diamante.",
        duration: "50 min",
      },
      {
        name: "Radiofrecuencia facial",
        description: "Tratamiento antiage de firmeza y tono.",
        duration: "45 min",
      },
      {
        name: "Masaje facial Kobido",
        description: "Lifting natural a través del tacto japonés.",
        duration: "60 min",
      },
    ],
  },
  {
    id: "cejas-pestanas",
    eyebrow: "Cejas y Pestañas",
    title: "Diseño de Mirada",
    intro: "Diseño a medida de tu mirada — sutil, definido, tuyo.",
    Icon: Eye,
    services: [
      {
        name: "Diseño y perfilado de cejas",
        description: "Forma personalizada según tu rostro.",
        duration: "30 min",
      },
      {
        name: "Henna / tinte de cejas",
        description: "Color natural y definición duradera.",
        duration: "40 min",
      },
      {
        name: "Laminado de cejas",
        description: "Efecto peinado y voluminoso por semanas.",
        duration: "45 min",
      },
      {
        name: "Lifting de pestañas + tinte",
        description: "Curva natural sin extensiones.",
        duration: "60 min",
      },
      {
        name: "Extensiones pelo a pelo",
        description: "Mirada definida con acabado natural.",
        duration: "120 min",
      },
      {
        name: "Volumen ruso",
        description: "Densidad máxima con técnica avanzada.",
        duration: "150 min",
      },
    ],
  },
  {
    id: "corporal",
    eyebrow: "Corporal",
    title: "Bienestar y Masajes",
    intro: "Bienestar integral a través del tacto, el aroma y la respiración.",
    Icon: Flower2,
    services: [
      {
        name: "Masaje descontracturante",
        description: "Alivia tensiones y mejora la movilidad.",
        duration: "60 min",
      },
      {
        name: "Masaje relajante con aromaterapia",
        description: "Aceites esenciales para una pausa profunda.",
        duration: "60 min",
      },
      {
        name: "Drenaje linfático manual",
        description: "Reduce retención y mejora la circulación.",
        duration: "75 min",
      },
      {
        name: "Tratamiento reductor",
        description: "Combate la flacidez y la celulitis.",
        duration: "60 min",
      },
      {
        name: "Maderoterapia",
        description: "Modelado corporal con elementos naturales.",
        duration: "60 min",
      },
      {
        name: "Exfoliación + hidratación",
        description: "Piel renovada y sedosa al instante.",
        duration: "75 min",
      },
    ],
  },
  {
    id: "makeup",
    eyebrow: "Depilación y Makeup",
    title: "Servicios Complementarios",
    intro:
      "Servicios complementarios para que llegues lista al momento que importa.",
    Icon: Brush,
    services: [
      {
        name: "Cera tibia descartable",
        description: "Depilación corporal segura e higiénica.",
        duration: "30 a 60 min",
      },
      {
        name: "Cera brasileña / ingle completa",
        description: "Resultado prolijo y duradero.",
        duration: "30 min",
      },
      {
        name: "Maquillaje social",
        description: "Estilo a medida para tu evento.",
        duration: "60 min",
      },
      {
        name: "Maquillaje y peinado de novia",
        description: "Paquete completo + prueba previa.",
        duration: "120 min",
      },
      {
        name: "Asesoramiento de imagen",
        description: "Sesión personalizada de estilo.",
        duration: "60 min",
      },
    ],
  },
];

function HeroBlock() {
  return (
    <section className="relative px-6 md:px-16 pt-40 pb-24 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-px bg-accent/40" />
          <p className="text-[10px] tracking-[0.35em] text-accent uppercase">
            Nuestros Rituales
          </p>
          <div className="w-12 h-px bg-accent/40" />
        </div>
        <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-10">
          Servicios pensados para cuidar tu belleza
        </h1>
        <p className="text-sm md:text-base text-muted leading-relaxed max-w-2xl mx-auto">
          Cada tratamiento es una experiencia diseñada con productos premium y
          técnicas profesionales. Elegí el ritual que más resuene con vos.
        </p>
      </div>
    </section>
  );
}

function CategoryBlock({ category }: { category: Category }) {
  const { Icon } = category;
  return (
    <section
      id={category.id}
      className="px-6 md:px-16 py-24 bg-background scroll-mt-[140px]"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8 max-w-7xl mx-auto">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
            <p className="text-[10px] tracking-[0.35em] text-accent uppercase">
              {category.eyebrow}
            </p>
          </div>
          <h2 className="heading-display text-4xl md:text-6xl text-white mb-6">
            {category.title}
          </h2>
          <p className="text-sm text-muted leading-relaxed">{category.intro}</p>
        </div>
        <p className="text-[10px] tracking-[0.3em] text-muted/60 uppercase self-start md:self-end">
          {String(category.services.length).padStart(2, "0")} servicios
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-white/5 max-w-7xl mx-auto">
        {category.services.map((service) => (
          <article
            key={service.name}
            className="bg-card-light p-8 flex flex-col gap-4 hover:bg-card transition-colors duration-300 group"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight leading-tight">
                {service.name}
              </h3>
              {service.duration ? (
                <span className="text-[10px] tracking-[0.2em] text-accent/80 uppercase whitespace-nowrap mt-1">
                  {service.duration}
                </span>
              ) : null}
            </div>
            <div className="w-6 h-px bg-accent/40" />
            <p className="text-sm text-muted leading-relaxed">
              {service.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EditorialBreak({ image, copy }: { image: string; copy: string }) {
  return (
    <section className="px-6 md:px-16 py-12 bg-background">
      <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-sm max-w-7xl mx-auto">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <p className="heading-display text-2xl md:text-4xl lg:text-5xl text-white text-center max-w-3xl">
            {copy}
          </p>
        </div>
      </div>
    </section>
  );
}

function HowItWorksBlock() {
  const steps = [
    {
      n: "01",
      title: "Elegí",
      desc: "Explorá nuestros servicios y encontrá el que se adapta a vos.",
    },
    {
      n: "02",
      title: "Reservá",
      desc: "Coordinamos tu turno por WhatsApp en menos de 5 minutos.",
    },
    {
      n: "03",
      title: "Vivilo",
      desc: "Te esperamos en nuestro espacio en Palermo para una experiencia única.",
    },
  ];

  return (
    <section className="px-6 md:px-16 py-24 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.35em] text-accent uppercase mb-6">
            Cómo funciona
          </p>
          <h2 className="heading-display text-4xl md:text-6xl text-white">
            Tres pasos para tu próximo ritual
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {steps.map((step) => (
            <div
              key={step.n}
              className="bg-card-light p-10 flex flex-col gap-6"
            >
              <p className="heading-display text-5xl text-accent">{step.n}</p>
              <div className="w-8 h-px bg-accent/40" />
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-6 md:px-16 py-40 bg-background text-center">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-px bg-accent/40" />
          <p className="text-[10px] tracking-[0.35em] text-accent uppercase">
            Reservá tu turno
          </p>
          <div className="w-12 h-px bg-accent/40" />
        </div>
        <h2 className="heading-display text-5xl md:text-6xl text-white mb-8">
          ¿Lista para tu próximo ritual?
        </h2>
        <p className="text-sm text-muted mb-12 max-w-lg mx-auto">
          Escribinos por WhatsApp y agendamos el momento perfecto para vos.
        </p>
        <a
          href="https://wa.me/5492281576513"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 border border-accent bg-accent text-black px-14 py-5 text-xs tracking-[0.25em] font-medium hover:bg-transparent hover:text-accent transition-all"
        >
          Reservar Turno
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <main>
      <HeroBlock />
      <CategoryNav
        categories={categories.map(({ id, eyebrow }) => ({ id, eyebrow }))}
      />
      {categories.map((cat, i) => (
        <div key={cat.id}>
          <CategoryBlock category={cat} />
          {i === 1 ? (
            <EditorialBreak
              image="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
              copy="Cada detalle, cuidado al milímetro."
            />
          ) : null}
          {i === 3 ? (
            <EditorialBreak
              image="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80"
              copy="Belleza que nace del ritual."
            />
          ) : null}
        </div>
      ))}
      <HowItWorksBlock />
      <FinalCta />
    </main>
  );
}
