"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/features/cart/store/cartStore";
import { cartService } from "@/features/cart/services/cartService";
import { ordersService } from "@/features/orders/services/ordersService";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useToast } from "@/components/ui/Toast";
import { apiClient } from "@/lib/api-client";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const PAYMENT_PROVIDERS = [
  { id: "mercadopago", label: "MercadoPago" },
  { id: "stripe", label: "Stripe" },
  { id: "paypal", label: "PayPal" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((s) => s.cart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [provider, setProvider] = useState("mercadopago");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      cartService.getCart();
      apiClient
        .get<Address[]>("/addresses")
        .then(({ data }) => {
          setAddresses(data);
          if (data.length > 0) setSelectedAddressId(data[0].id);
        })
        .catch(() => {
          // Las direcciones no son criticas para cargar la pagina
        });
    }
  }, [isAuthenticated]);

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const canSubmit =
    selectedAddressId && receiverName.trim() && phone.trim() && !isSubmitting;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const order = await ordersService.checkout({
        addressId: selectedAddressId,
        receiverName: receiverName.trim(),
        phone: phone.trim(),
        additionalInfo: additionalInfo.trim() || undefined,
      });

      // Iniciar pago
      const payment = await ordersService.pay(order.id, { provider });

      if (payment.redirectUrl) {
        window.location.href = payment.redirectUrl;
        return;
      }

      // Si no hay redirect (ej: clientSecret para Stripe), ir al detalle
      showToast("Orden creada exitosamente");
      router.push(`/orders/${order.id}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al procesar la orden";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background pt-28 pb-20">
        <section className="px-6 md:px-20 lg:px-32">
          <div className="text-center py-20">
            <p className="text-muted text-sm tracking-widest uppercase mb-6">
              Inicia sesion para continuar
            </p>
            <Link
              href="/login"
              className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-widest text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Iniciar sesion
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      {/* Header */}
      <section className="px-6 md:px-20 lg:px-32 mb-12">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors text-[0.65rem] tracking-[0.15em] uppercase mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al carrito
        </Link>
        <h1 className="heading-display text-5xl md:text-5xl lg:text-6xl text-white mb-3">
          PROCEDER CON LA COMPRA
        </h1>
      </section>

      {items.length === 0 ? (
        <section className="px-6 md:px-20 lg:px-32">
          <div className="text-center py-20">
            <p className="text-muted text-sm tracking-widest uppercase mb-6">
              Tu carrito esta vacio
            </p>
            <Link
              href="/catalogue"
              className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-widest text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Explorar catalogo
            </Link>
          </div>
        </section>
      ) : (
        <section className="px-6 md:px-20 lg:px-32">
          <form
            onSubmit={handleCheckout}
            className="flex flex-col lg:flex-row gap-40"
          >
            {/* Form */}
            <div className="flex-1 space-y-10">
              {/* Address Selection */}
              <div>
                <h2 className="text-[0.7rem] tracking-[0.25em] text-white uppercase font-semibold mb-6">
                  Direccion de envio
                </h2>
                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block border p-5 cursor-pointer transition-colors ${
                          selectedAddressId === addr.id
                            ? "border-white/40 bg-card"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="sr-only"
                        />
                        <p className="text-sm text-white">{addr.street}</p>
                        <p className="text-xs text-muted mt-1">
                          {addr.city}, {addr.state} {addr.zipCode} -{" "}
                          {addr.country}
                        </p>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted tracking-widest uppercase">
                    No tienes direcciones guardadas. Agrega una desde tu perfil.
                  </p>
                )}
              </div>

              {/* Receiver Info */}
              <div>
                <h2 className="text-[0.7rem] tracking-[0.25em] text-white uppercase font-semibold mb-6">
                  Datos del receptor
                </h2>
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-3 group-focus-within:text-white transition-colors">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      required
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Juan Perez"
                      className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white outline-none focus:border-white/40 transition-colors placeholder:text-muted/20"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-3 group-focus-within:text-white transition-colors">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+54 9 11 1234-5678"
                      className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white outline-none focus:border-white/40 transition-colors placeholder:text-muted/20"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-3 group-focus-within:text-white transition-colors">
                      Informacion adicional (opcional)
                    </label>
                    <input
                      type="text"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Casa de rejas blancas, timbre 2B..."
                      className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white outline-none focus:border-white/40 transition-colors placeholder:text-muted/20"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Provider */}
              <div>
                <h2 className="text-[0.7rem] tracking-[0.25em] text-white uppercase font-semibold mb-6">
                  Metodo de pago
                </h2>
                <div className="flex flex-wrap gap-3">
                  {PAYMENT_PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProvider(p.id)}
                      className={`px-6 py-3 text-[0.65rem] tracking-[0.15em] uppercase font-medium border transition-all cursor-pointer ${
                        provider === p.id
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-muted border-white/20 hover:border-white/50 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs tracking-widest">{error}</p>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-card p-8">
                <h2 className="text-[0.7rem] tracking-[0.25em] text-white uppercase font-semibold mb-8">
                  Tu pedido
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex-1 mr-4">
                        <p className="text-xs text-white uppercase truncate">
                          {item.variant.product.name}
                        </p>
                        <p className="text-[0.6rem] text-muted">
                          {Object.entries(item.variant.attributes)
                            .map(
                              ([key, value]) =>
                                `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
                            )
                            .join(" / ")}{" "}
                          x {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs text-white shrink-0">
                        $
                        {(item.unitPrice * item.quantity).toLocaleString(
                          "en-US",
                          { minimumFractionDigits: 2 },
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 my-6" />

                <div className="flex items-center justify-between mb-8">
                  <span className="text-[0.7rem] tracking-[0.25em] text-muted uppercase">
                    Total
                  </span>
                  <span className="text-2xl md:text-3xl text-white font-light">
                    $
                    {subtotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-white text-black py-4 text-[0.65rem] tracking-[0.2em] uppercase font-semibold hover:bg-foreground transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar y pagar"
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
