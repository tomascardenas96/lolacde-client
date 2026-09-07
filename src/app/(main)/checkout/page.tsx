"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/features/cart/store/cartStore";
import { cartService } from "@/features/cart/services/cartService";
import { ordersService } from "@/features/orders/services/ordersService";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useAddressesStore } from "@/features/addresses/store/addressesStore";
import { addressesService } from "@/features/addresses/services/addressesService";
import { shippingService } from "@/features/shipping/services/shippingService";
import { discountService } from "@/features/discount/services/discountService";
import type { ShippingMethod } from "@/features/shipping/types/state.types";
import type { DiscountValidation } from "@/features/discount/types/state.types";
import { useToast } from "@/components/ui/Toast";
import { getApiErrorMessage } from "@/lib/error-utils";
import { ArrowLeft, Loader2, Tag, X } from "lucide-react";

const formatMoney = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2 });

// Único proveedor habilitado. Para sumar otro (Stripe, PayPal, etc.) basta con
// registrarlo en el backend (token PAYMENT_PROVIDERS) y agregarlo a esta lista.
const PAYMENT_PROVIDERS = [{ id: "mercadopago", label: "MercadoPago" }];

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((s) => s.cart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addresses = useAddressesStore((s) => s.addresses);
  const { showToast } = useToast();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [provider, setProvider] = useState("mercadopago");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Envío
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>("");

  // Cupón
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountValidation | null>(
    null,
  );
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      cartService.getCart();
      addressesService.getAddresses();
      shippingService
        .getShippingMethods()
        .then(setShippingMethods)
        .catch(() => setShippingMethods([]));
    }
  }, [isAuthenticated]);

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const selectedShipping = shippingMethods.find(
    (m) => m.id === selectedShippingId,
  );
  const shippingCost = selectedShipping ? Number(selectedShipping.price) : 0;
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const total = Math.max(0, subtotal + shippingCost - discountAmount);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
      const result = await discountService.validateCoupon(code, subtotal);
      setAppliedCoupon(result);
      showToast("Cupón aplicado");
    } catch (err: unknown) {
      setCouponError(getApiErrorMessage(err, "Cupón inválido"));
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  };

  // Dirección efectiva: la elegida por el usuario si sigue siendo válida; si no,
  // la predeterminada (o la primera). Derivado para no sincronizar vía efecto.
  const effectiveAddressId =
    selectedAddressId && addresses.some((a) => a.id === selectedAddressId)
      ? selectedAddressId
      : ((addresses.find((a) => a.isDefault) ?? addresses[0])?.id ?? "");

  // Si hay métodos de envío disponibles, exigimos que se elija uno.
  const requiresShipping = shippingMethods.length > 0;
  const canSubmit =
    effectiveAddressId &&
    receiverName.trim() &&
    phone.trim() &&
    (!requiresShipping || !!selectedShippingId) &&
    !isSubmitting;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const order = await ordersService.checkout({
        addressId: effectiveAddressId,
        receiverName: receiverName.trim(),
        phone: phone.trim(),
        additionalInfo: additionalInfo.trim() || undefined,
        shippingMethodId: selectedShippingId || undefined,
        discountCode: appliedCoupon?.code,
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
    <main className="min-h-[calc(100vh-7rem)] bg-background pt-28 pb-20 grid">
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
            className="flex flex-col lg:flex-row gap-12"
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
                          effectiveAddressId === addr.id
                            ? "border-white/40 bg-card"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={effectiveAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="sr-only"
                        />
                        <p className="text-sm text-white">{addr.addressLine}</p>
                        <p className="text-xs text-muted mt-1">
                          {addr.city}, {addr.state}
                          {addr.zipCode ? ` ${addr.zipCode}` : ""} -{" "}
                          {addr.country}
                        </p>
                      </label>
                    ))}
                    <Link
                      href="/addresses"
                      className="inline-block text-[0.6rem] tracking-[0.15em] uppercase text-muted hover:text-white transition-colors mt-2"
                    >
                      Gestionar direcciones
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/addresses"
                    className="inline-block border border-white/20 px-6 py-3 text-[0.6rem] tracking-[0.15em] text-white uppercase hover:bg-white hover:text-black transition-all"
                  >
                    Agregar una dirección
                  </Link>
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

              {/* Shipping Method */}
              {shippingMethods.length > 0 && (
                <div>
                  <h2 className="text-[0.7rem] tracking-[0.25em] text-white uppercase font-semibold mb-6">
                    Metodo de envio
                  </h2>
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between border p-5 cursor-pointer transition-colors ${
                          selectedShippingId === method.id
                            ? "border-white/40 bg-card"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={selectedShippingId === method.id}
                            onChange={() => setSelectedShippingId(method.id)}
                            className="sr-only"
                          />
                          <div>
                            <p className="text-sm text-white">{method.name}</p>
                            <p className="text-xs text-muted mt-1">
                              {method.estimatedDays}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-white">
                          ${formatMoney(Number(method.price))}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
                      <div className="flex-1 min-w-0 mr-4">
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

                {/* Coupon */}
                <div className="mb-6">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-background/40 border border-white/10 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs text-white uppercase tracking-[0.1em]">
                          {appliedCoupon.code}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        aria-label="Quitar cupón"
                        className="text-muted hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Código de cupón"
                        className="flex-1 min-w-0 bg-transparent border border-white/10 px-3 py-2.5 text-xs text-white outline-none focus:border-white/40 transition-colors placeholder:text-muted/30 uppercase tracking-[0.1em]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponInput.trim()}
                        className="shrink-0 border border-white/20 px-4 text-[0.6rem] tracking-[0.15em] uppercase text-white hover:bg-white hover:text-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isValidatingCoupon ? "..." : "Aplicar"}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-red-400 text-[0.65rem] mt-2">
                      {couponError}
                    </p>
                  )}
                </div>

                {/* Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted uppercase tracking-[0.1em]">
                      Subtotal
                    </span>
                    <span className="text-xs text-white">
                      ${formatMoney(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted uppercase tracking-[0.1em]">
                      Envío
                    </span>
                    <span className="text-xs text-white">
                      {selectedShipping ? `$${formatMoney(shippingCost)}` : "—"}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted uppercase tracking-[0.1em]">
                        Descuento
                      </span>
                      <span className="text-xs text-accent">
                        −${formatMoney(discountAmount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 my-6" />

                <div className="flex items-center justify-between mb-8">
                  <span className="text-[0.7rem] tracking-[0.25em] text-muted uppercase">
                    Total
                  </span>
                  <span className="text-2xl md:text-3xl text-white font-light">
                    ${formatMoney(total)}
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
