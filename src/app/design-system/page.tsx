"use client";

import { useState } from "react";
import {
  ArrowRight,
  Heart,
  Search,
  Settings,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Divider,
  Eyebrow,
  IconButton,
  Input,
  Modal,
  Radio,
  SectionHeading,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
} from "@/components/ui";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 border-t border-white/5">
      <div className="mb-12">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </div>
      {children}
    </section>
  );
}

function SwatchRow({
  label,
  swatches,
}: {
  label: string;
  swatches: { name: string; value: string; cls?: string }[];
}) {
  return (
    <div>
      <p className="text-[0.625rem] tracking-[0.3em] text-muted uppercase mb-4">
        {label}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {swatches.map((s) => (
          <div key={s.name} className="flex flex-col gap-2">
            <div
              className={`aspect-square border border-white/5 ${s.cls ?? ""}`}
              style={s.cls ? undefined : { background: s.value }}
            />
            <div>
              <p className="text-[0.625rem] text-white tracking-[0.1em] uppercase">
                {s.name}
              </p>
              <p className="text-[0.55rem] text-muted/60 font-mono">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stack({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>;
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function Demo({
  label,
  children,
  description,
}: {
  label: string;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="border border-white/5 bg-surface-1">
      <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
        <p className="text-[0.625rem] tracking-[0.3em] text-muted uppercase">
          {label}
        </p>
        {description && (
          <p className="text-[0.625rem] text-muted/60">{description}</p>
        )}
      </div>
      <div className="px-6 py-8">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation (sticky)                                                 */
/* ------------------------------------------------------------------ */
const NAV = [
  { id: "foundations", label: "Foundations" },
  { id: "colors", label: "Color" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "motion", label: "Motion" },
  { id: "buttons", label: "Buttons" },
  { id: "inputs", label: "Inputs" },
  { id: "selection", label: "Selection" },
  { id: "feedback", label: "Feedback" },
  { id: "data", label: "Data Display" },
  { id: "overlays", label: "Overlays" },
  { id: "patterns", label: "Patterns" },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState("preview");

  return (
    <div className="min-h-screen bg-background text-white">
      {/* ──────────────────────────────────────────────  HERO  ── */}
      <header className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <Eyebrow variant="default" className="mb-6">
            Design System · v1.0
          </Eyebrow>
          <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl mb-8 text-balance">
            EL LENGUAJE
            <br />
            <span className="text-accent">VISUAL.</span>
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl leading-relaxed">
            Sistema editorial oscuro construido sobre tokens. Tipografía
            tipo-magazine, acentos en champagne, y primitivos sin radio para una
            estética arquitectónica.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="primary">Empezar</Button>
            <Button variant="outline" trailing={<ArrowRight className="w-3.5 h-3.5" />}>
              Ver componentes
            </Button>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────  NAVIGATION  ── */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-1 overflow-x-auto py-3 -mx-2 px-2 scrollbar-thin">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-3 py-1.5 text-[0.625rem] tracking-[0.25em] uppercase text-muted hover:text-white whitespace-nowrap transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12">
        {/* ─────────────────────────────────  FOUNDATIONS  ── */}
        <Section
          id="foundations"
          eyebrow="01 — Foundations"
          title="Principios"
          description="Tres ideas que sostienen cada decisión visual."
        >
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                n: "I",
                t: "Editorial primero",
                d: "Inspirado en revistas de moda y arquitectura. Tipografía display itálica, jerarquía tipográfica fuerte, mucho espacio negativo.",
              },
              {
                n: "II",
                t: "Lujo silencioso",
                d: "Champagne como acento puntual sobre negro profundo. Nada grita; todo respira. Detalles sutiles, no decoración.",
              },
              {
                n: "III",
                t: "Bordes sobre rellenos",
                d: "Líneas finas en lugar de cajas pesadas. Sin radios. Las superficies se distinguen por contraste de luminancia, no por sombras.",
              },
            ].map((p) => (
              <Card key={p.n} variant="outline" className="p-8">
                <span className="text-[2.5rem] font-light italic text-accent leading-none">
                  {p.n}
                </span>
                <h3 className="mt-6 text-lg uppercase tracking-[0.15em]">
                  {p.t}
                </h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{p.d}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ─────────────────────────────────────  COLOR  ── */}
        <Section
          id="colors"
          eyebrow="02 — Color"
          title="Paleta"
          description="Una escala neutra profunda y una rampa de champagne para el acento."
        >
          <Stack>
            <SwatchRow
              label="Superficies"
              swatches={[
                { name: "surface-0", value: "#0a0a0a" },
                { name: "surface-1", value: "#121212" },
                { name: "surface-2", value: "#1a1a1a" },
                { name: "surface-3", value: "#232323" },
                { name: "surface-4", value: "#2a2a2a" },
                { name: "surface-5", value: "#353535" },
              ]}
            />
            <SwatchRow
              label="Acento — Champagne"
              swatches={[
                { name: "50", value: "#faf6f0" },
                { name: "100", value: "#f1e7d6" },
                { name: "200", value: "#e3d0ad" },
                { name: "300", value: "#d4b893" },
                { name: "400", value: "#c8a97e" },
                { name: "500", value: "#b8946a" },
                { name: "600", value: "#9a7a55" },
                { name: "700", value: "#785e41" },
                { name: "800", value: "#56432e" },
                { name: "900", value: "#34281c" },
              ]}
            />
            <SwatchRow
              label="Semánticos"
              swatches={[
                { name: "success", value: "#22c55e" },
                { name: "warning", value: "#f59e0b" },
                { name: "danger", value: "#ef4444" },
                { name: "info", value: "#60a5fa" },
              ]}
            />
            <SwatchRow
              label="Texto"
              swatches={[
                { name: "primary", value: "#ededed" },
                { name: "secondary", value: "#b8b8b8" },
                { name: "muted", value: "#888888" },
                { name: "subtle", value: "#565656" },
                { name: "disabled", value: "#3a3a3a" },
              ]}
            />
          </Stack>
        </Section>

        {/* ────────────────────────────────  TYPOGRAPHY  ── */}
        <Section
          id="typography"
          eyebrow="03 — Typography"
          title="Tipografía"
          description="Manrope como base, con utilidad display itálica para titulares."
        >
          <Stack>
            <Demo label="Display — Hero">
              <h1 className="heading-display text-6xl md:text-8xl text-balance">
                EL ARTE DE LA<br />TRANSFORMACIÓN.
              </h1>
            </Demo>
            <Demo label="Display — Section">
              <h2 className="heading-display text-4xl md:text-6xl text-balance">
                Cuidado integral
              </h2>
            </Demo>
            <Demo label="Headings">
              <div className="space-y-4">
                <h1 className="text-4xl font-medium">Heading 1 — 36px</h1>
                <h2 className="text-3xl font-medium">Heading 2 — 30px</h2>
                <h3 className="text-2xl font-medium">Heading 3 — 24px</h3>
                <h4 className="text-xl font-medium">Heading 4 — 20px</h4>
                <h5 className="text-lg font-medium">Heading 5 — 18px</h5>
              </div>
            </Demo>
            <Demo label="Body">
              <div className="space-y-3">
                <p className="text-base text-white">
                  Body L — Cuidado profesional con productos premium para
                  realzar tu belleza natural.
                </p>
                <p className="text-sm text-white/80">
                  Body M — Cuidado profesional con productos premium para
                  realzar tu belleza natural.
                </p>
                <p className="text-xs text-muted">
                  Body S — Caption / metadata / disclaimers en texto secundario.
                </p>
              </div>
            </Demo>
            <Demo label="Utility — Eyebrow / Label">
              <div className="space-y-4">
                <Eyebrow>Eyebrow estándar</Eyebrow>
                <Eyebrow variant="centered">Eyebrow centrado</Eyebrow>
                <p className="label-caps">Label caps · metadata</p>
              </div>
            </Demo>
          </Stack>
        </Section>

        {/* ────────────────────────────────  SPACING  ── */}
        <Section
          id="spacing"
          eyebrow="04 — Spacing"
          title="Escala"
          description="Sistema 4px. Las superficies se separan por bordes finos, no por sombras."
        >
          <Demo label="Spacing scale">
            <div className="space-y-3">
              {[
                { name: "1", value: "4px" },
                { name: "2", value: "8px" },
                { name: "3", value: "12px" },
                { name: "4", value: "16px" },
                { name: "6", value: "24px" },
                { name: "8", value: "32px" },
                { name: "12", value: "48px" },
                { name: "16", value: "64px" },
                { name: "24", value: "96px" },
              ].map((s) => (
                <div key={s.name} className="flex items-center gap-4">
                  <span className="w-12 text-[0.625rem] text-muted tracking-[0.2em] uppercase">
                    {s.name}
                  </span>
                  <div className="h-2 bg-accent" style={{ width: s.value }} />
                  <span className="text-[0.625rem] text-muted/60 font-mono">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </Demo>
        </Section>

        {/* ────────────────────────────────  MOTION  ── */}
        <Section
          id="motion"
          eyebrow="05 — Motion"
          title="Movimiento"
          description="Curvas de easing largas y suaves. Nada salta; todo desliza."
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Demo label="fade-in-up · 500ms">
              <div className="animate-fade-in-up bg-accent text-black px-6 py-4 inline-block tracking-[0.2em] text-xs uppercase">
                Aparezco con gracia
              </div>
            </Demo>
            <Demo label="scale-in · 300ms">
              <div className="animate-scale-in bg-surface-3 border border-white/10 px-6 py-4 inline-block tracking-[0.2em] text-xs uppercase">
                Escalo desde 96%
              </div>
            </Demo>
            <Demo label="shimmer · 2s loop">
              <Skeleton className="h-12 w-full" />
            </Demo>
            <Demo label="navbar-slide-down · 300ms">
              <div className="animate-navbar-slide-down bg-surface-2 border border-white/10 px-6 py-4 inline-block tracking-[0.2em] text-xs uppercase">
                Deslizo desde arriba
              </div>
            </Demo>
          </div>
        </Section>

        {/* ────────────────────────────────  BUTTONS  ── */}
        <Section
          id="buttons"
          eyebrow="06 — Buttons"
          title="Botones"
          description="Seis variantes, tres tamaños, estados de carga y soporte de íconos."
        >
          <Stack>
            <Demo label="Variants">
              <Row>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="link">Link</Button>
              </Row>
            </Demo>
            <Demo label="Sizes">
              <Row>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </Row>
            </Demo>
            <Demo label="Con íconos">
              <Row>
                <Button leading={<Sparkles className="w-3.5 h-3.5" />}>
                  Con leading
                </Button>
                <Button
                  variant="outline"
                  trailing={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Con trailing
                </Button>
                <Button variant="secondary" loading>
                  Cargando
                </Button>
                <Button disabled>Disabled</Button>
              </Row>
            </Demo>
            <Demo label="Icon buttons">
              <Row>
                <IconButton
                  variant="ghost"
                  icon={<Heart className="w-4 h-4" />}
                  label="Favorito"
                />
                <IconButton
                  variant="outline"
                  icon={<Search className="w-4 h-4" />}
                  label="Buscar"
                />
                <IconButton
                  variant="solid"
                  icon={<Settings className="w-4 h-4" />}
                  label="Ajustes"
                />
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  label="Eliminar"
                />
              </Row>
            </Demo>
          </Stack>
        </Section>

        {/* ────────────────────────────────  INPUTS  ── */}
        <Section
          id="inputs"
          eyebrow="07 — Inputs"
          title="Campos de formulario"
          description="Inputs con bordes finos, labels en mayúsculas y soporte completo de estados."
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Demo label="Input — estándar">
              <Input label="Email" placeholder="hola@lola.com.ar" />
            </Demo>
            <Demo label="Input — con leading">
              <Input
                label="Buscar"
                leading={<Search className="w-4 h-4" />}
                placeholder="Buscar productos..."
              />
            </Demo>
            <Demo label="Input — con error">
              <Input
                label="Contraseña"
                type="password"
                defaultValue="123"
                error="Mínimo 8 caracteres"
              />
            </Demo>
            <Demo label="Input — con hint">
              <Input
                label="Nombre de usuario"
                placeholder="@usuario"
                hint="3 a 20 caracteres, sin espacios."
              />
            </Demo>
            <Demo label="Textarea">
              <Textarea
                label="Mensaje"
                placeholder="Contanos cómo podemos ayudarte..."
              />
            </Demo>
            <Demo label="Select">
              <Select label="Categoría" defaultValue="">
                <option value="" disabled>
                  Elegí una opción
                </option>
                <option value="skin">Skincare</option>
                <option value="hair">Hair</option>
                <option value="body">Body</option>
              </Select>
            </Demo>
          </div>
        </Section>

        {/* ────────────────────────────────  SELECTION  ── */}
        <Section
          id="selection"
          eyebrow="08 — Selection"
          title="Controles de selección"
          description="Checkboxes, radios y switches alineados al lenguaje editorial."
        >
          <div className="grid md:grid-cols-3 gap-4">
            <Demo label="Checkbox">
              <div className="space-y-4">
                <Checkbox label="Recordarme" />
                <Checkbox
                  label="Recibir novedades"
                  description="Una vez al mes, sin spam."
                  defaultChecked
                />
                <Checkbox label="Disabled" disabled />
              </div>
            </Demo>
            <Demo label="Radio">
              <div className="space-y-4">
                <Radio name="ds-radio" value="a" label="Envío estándar" defaultChecked />
                <Radio
                  name="ds-radio"
                  value="b"
                  label="Envío express"
                  description="Llega en 24 horas hábiles."
                />
                <Radio name="ds-radio" value="c" label="Retiro en local" />
              </div>
            </Demo>
            <Demo label="Switch">
              <div className="space-y-4">
                <Switch label="Modo oscuro" defaultChecked />
                <Switch
                  label="Notificaciones"
                  description="Te avisamos por mail."
                />
                <Switch label="Disabled" disabled />
              </div>
            </Demo>
          </div>
        </Section>

        {/* ────────────────────────────────  FEEDBACK  ── */}
        <Section
          id="feedback"
          eyebrow="09 — Feedback"
          title="Estados y mensajes"
          description="Alerts, spinners y skeletons para comunicar progreso y resultado."
        >
          <Stack>
            <Demo label="Alerts">
              <div className="space-y-3">
                <Alert variant="info" title="Información">
                  Esta orden está en proceso de confirmación.
                </Alert>
                <Alert variant="success" title="Confirmado">
                  Tu reserva fue registrada correctamente.
                </Alert>
                <Alert variant="warning" title="Atención">
                  El stock disponible es limitado.
                </Alert>
                <Alert variant="danger" title="Error">
                  No pudimos procesar el pago. Revisá los datos.
                </Alert>
              </div>
            </Demo>
            <Demo label="Spinners">
              <Row>
                <Spinner size="xs" />
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner label="Cargando" />
              </Row>
            </Demo>
            <Demo label="Skeletons">
              <div className="space-y-3 max-w-md">
                <Skeleton variant="circle" className="w-12 h-12" />
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </Demo>
          </Stack>
        </Section>

        {/* ────────────────────────────────  DATA DISPLAY  ── */}
        <Section
          id="data"
          eyebrow="10 — Data Display"
          title="Visualización"
          description="Cards, badges, avatars y dividers para componer interfaces."
        >
          <Stack>
            <Demo label="Badges">
              <Row>
                <Badge>Default</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="success" dot>
                  En curso
                </Badge>
                <Badge variant="warning" dot>
                  Pendiente
                </Badge>
                <Badge variant="danger" dot>
                  Cancelado
                </Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="outline">Outline</Badge>
              </Row>
            </Demo>
            <Demo label="Avatars">
              <Row>
                <Avatar fallback="LC" size="xs" />
                <Avatar fallback="Tomás Cárdenas" size="sm" />
                <Avatar fallback="MJ" size="md" status="online" />
                <Avatar fallback="AB" size="lg" status="busy" />
                <Avatar fallback="ZZ" size="xl" status="away" />
              </Row>
            </Demo>
            <Demo label="Dividers">
              <div className="space-y-6">
                <Divider variant="subtle" />
                <Divider variant="default" />
                <Divider variant="accent" />
                <Divider variant="gradient" />
                <Divider label="o continuá con" variant="default" />
              </div>
            </Demo>
            <Demo label="Card composition">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Producto destacado</CardTitle>
                    <CardDescription>
                      Crema antiedad con vitamina C, formulación premium.
                    </CardDescription>
                  </CardHeader>
                  <CardBody>
                    <p className="text-3xl font-light italic text-accent">
                      $24.900
                    </p>
                    <p className="text-[0.625rem] tracking-[0.3em] text-muted uppercase mt-2">
                      50ml · stock disponible
                    </p>
                  </CardBody>
                  <CardFooter>
                    <Button size="sm" variant="ghost">
                      Detalles
                    </Button>
                    <Button size="sm">Agregar</Button>
                  </CardFooter>
                </Card>
                <Card variant="elevated" interactive>
                  <CardBody>
                    <Badge variant="accent" className="mb-4">
                      Nuevo
                    </Badge>
                    <h4 className="text-base uppercase tracking-[0.15em]">
                      Ritual nocturno
                    </h4>
                    <p className="text-sm text-muted mt-2 leading-relaxed">
                      Kit completo de skincare nocturno con tres pasos.
                    </p>
                  </CardBody>
                </Card>
                <Card variant="outline">
                  <CardBody>
                    <CardTitle>Outline card</CardTitle>
                    <CardDescription>
                      Para contextos secundarios o agrupaciones.
                    </CardDescription>
                  </CardBody>
                </Card>
              </div>
            </Demo>
          </Stack>
        </Section>

        {/* ────────────────────────────────  OVERLAYS  ── */}
        <Section
          id="overlays"
          eyebrow="11 — Overlays"
          title="Capas superiores"
          description="Modales, tooltips y tabs para flujos en profundidad."
        >
          <Stack>
            <Demo label="Modal">
              <Button onClick={() => setModalOpen(true)} variant="outline">
                Abrir modal
              </Button>
              <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                eyebrow="Confirmación"
                title="¿Eliminar producto?"
                footer={
                  <>
                    <Button variant="ghost" onClick={() => setModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="danger" onClick={() => setModalOpen(false)}>
                      Eliminar
                    </Button>
                  </>
                }
              >
                <p className="text-sm text-muted leading-relaxed">
                  Esta acción es permanente. El producto y todas sus variantes
                  serán eliminados del catálogo.
                </p>
              </Modal>
            </Demo>
            <Demo label="Tooltip">
              <Row>
                <Tooltip content="Editar">
                  <IconButton
                    variant="ghost"
                    icon={<Settings className="w-4 h-4" />}
                    label="Editar"
                  />
                </Tooltip>
                <Tooltip content="Top" side="top">
                  <Button size="sm" variant="outline">
                    Top
                  </Button>
                </Tooltip>
                <Tooltip content="Right" side="right">
                  <Button size="sm" variant="outline">
                    Right
                  </Button>
                </Tooltip>
                <Tooltip content="Bottom" side="bottom">
                  <Button size="sm" variant="outline">
                    Bottom
                  </Button>
                </Tooltip>
              </Row>
            </Demo>
            <Demo label="Tabs">
              <Tabs value={tab} onValueChange={setTab} defaultValue="preview">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="specs">Specs</TabsTrigger>
                  <TabsTrigger value="usage">Uso</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <p className="text-sm text-muted leading-relaxed max-w-2xl">
                    Vista previa visual del componente. Los tabs comparten un
                    indicador sutil en champagne para preservar la jerarquía.
                  </p>
                </TabsContent>
                <TabsContent value="specs">
                  <p className="text-sm text-muted leading-relaxed max-w-2xl">
                    Especificaciones técnicas: dimensiones, tokens utilizados,
                    estados accesibles.
                  </p>
                </TabsContent>
                <TabsContent value="usage">
                  <p className="text-sm text-muted leading-relaxed max-w-2xl">
                    Pautas de uso: cuándo aplicar este componente y combinaciones
                    recomendadas.
                  </p>
                </TabsContent>
              </Tabs>
            </Demo>
          </Stack>
        </Section>

        {/* ────────────────────────────────  PATTERNS  ── */}
        <Section
          id="patterns"
          eyebrow="12 — Patterns"
          title="Patrones compuestos"
          description="Ejemplos reales que combinan primitivos."
        >
          <Stack>
            <Demo label="Form section">
              <form className="max-w-md space-y-5">
                <Input label="Nombre" placeholder="Tu nombre" />
                <Input label="Email" type="email" placeholder="hola@..." />
                <Textarea label="Mensaje" placeholder="¿En qué te ayudamos?" />
                <Checkbox label="Acepto recibir el newsletter mensual" />
                <Divider variant="subtle" />
                <Row>
                  <Button variant="primary">Enviar</Button>
                  <Button variant="ghost">Cancelar</Button>
                </Row>
              </form>
            </Demo>
            <Demo label="Stat row">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                {[
                  { l: "Ventas", v: "$284.5K", d: "+12.4%" },
                  { l: "Clientes", v: "1,284", d: "+8.1%" },
                  { l: "Órdenes", v: "423", d: "-2.3%" },
                  { l: "Conv. rate", v: "3.42%", d: "+0.4%" },
                ].map((s) => (
                  <div key={s.l} className="bg-surface-1 px-6 py-8">
                    <p className="text-[0.625rem] tracking-[0.3em] text-muted uppercase">
                      {s.l}
                    </p>
                    <p className="text-3xl font-light italic mt-4">{s.v}</p>
                    <p className="text-xs text-accent mt-1">{s.d}</p>
                  </div>
                ))}
              </div>
            </Demo>
            <Demo label="User row">
              <div className="border border-white/5">
                {[
                  { n: "Lola Vega", e: "lola@centro.com", r: "Admin" },
                  { n: "Tomás Cárdenas", e: "tomi@centro.com", r: "Editor" },
                  { n: "Mariana Sosa", e: "mariana@centro.com", r: "Viewer" },
                ].map((u, i, a) => (
                  <div
                    key={u.e}
                    className={`flex items-center gap-4 px-5 py-4 ${
                      i < a.length - 1 ? "border-b border-white/5" : ""
                    }`}
                  >
                    <Avatar fallback={u.n} size="md" status="online" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{u.n}</p>
                      <p className="text-xs text-muted">{u.e}</p>
                    </div>
                    <Badge variant={u.r === "Admin" ? "accent" : "outline"}>
                      {u.r}
                    </Badge>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      icon={<Settings className="w-3.5 h-3.5" />}
                      label="Ajustes"
                    />
                  </div>
                ))}
              </div>
            </Demo>
            <Demo label="Empty state">
              <div className="border border-white/5 px-8 py-16 text-center">
                <User className="w-10 h-10 text-muted/40 mx-auto mb-6" strokeWidth={1} />
                <p className="text-[0.625rem] tracking-[0.3em] text-accent uppercase mb-3">
                  Sin resultados
                </p>
                <h3 className="text-xl heading-display mb-3">
                  Aún no hay clientes
                </h3>
                <p className="text-sm text-muted max-w-md mx-auto leading-relaxed mb-6">
                  Cuando se registren nuevos clientes los vas a ver acá.
                </p>
                <Button variant="outline" size="sm">
                  Invitar usuario
                </Button>
              </div>
            </Demo>
          </Stack>
        </Section>

        {/* ────────────────────────────────  FOOTER  ── */}
        <footer className="py-16 border-t border-white/5 text-center">
          <Divider variant="gradient" className="max-w-xs mx-auto mb-8" />
          <p className="text-[0.625rem] tracking-[0.3em] text-muted uppercase">
            Lola Design System · v1.0
          </p>
        </footer>
      </main>
    </div>
  );
}
