"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { authService } from "@/features/auth/services/authService";
import { useCartStore } from "@/features/cart/store/cartStore";
import { cartService } from "@/features/cart/services/cartService";
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Logo from "./Logo";

const navLinks = [
  { label: "INICIO", href: "/" },
  { label: "CATALOGO", href: "/catalogue" },
  { label: "SERVICIOS", href: "/services" },
  { label: "CONTACTO", href: "/contact" },
];

const SCROLL_THRESHOLD = 100;

export function Navbar() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role?.name?.toUpperCase() === "ADMIN";
  const cart = useCartStore((s) => s.cart);
  const cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const [isFixed, setIsFixed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Zustand persist rehydrates asynchronously — wait for it
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      cartService.getCart();
    }
  }, [hydrated, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await authService.logout();
  };

  return (
    <nav
      className={`left-0 right-0 z-50 flex items-center justify-between  transition-[padding,background-color] duration-500 ease-in-out ${
        isFixed
          ? "fixed top-0 animate-navbar-slide-down md:px-28 bg-black/15 py-5 backdrop-blur-sm"
          : "absolute top-0 animate-navbar-slide-up md:px-40 bg-transparent py-4"
      }`}
    >
      <Link
        href="/"
        className="text-xl font-black tracking-widest text-white pb-1"
      >
        <Logo compact={isFixed} />
      </Link>

      <ul className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`font-manrope tracking-[0.1rem] uppercase text-[0.7rem] py-3 font-medium text-neutral-400 hover:text-white transition-colors ${
                pathname === link.href
                  ? "text-white underline underline-offset-10 decoration-accent"
                  : "text-[#a7a7a7]"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-7">
        <Link
          href="/cart"
          className="relative text-white hover:text-muted transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-black text-[0.55rem] font-semibold w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {!hydrated ? null : isAuthenticated && user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 text-white hover:text-muted transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                <span className="text-xs font-semibold text-accent uppercase">
                  {user.name?.charAt(0)}
                  {user.lastname?.charAt(0)}
                </span>
              </div>
              <span className="hidden md:block text-xs tracking-wide font-medium max-w-[120px] truncate">
                {user.name}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-black/90 backdrop-blur-md border border-white/10 rounded-md shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name} {user.lastname}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {user.email}
                  </p>
                </div>

                <div className="py-1">
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-accent hover:bg-white/10 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Package className="w-3.5 h-3.5" />
                    Mis pedidos
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs tracking-widest text-white hover:text-muted transition-colors flex items-center gap-1"
          >
            INGRESAR
            <ChevronRight className="w-4 h-4 text-accent" />
          </Link>
        )}
      </div>
    </nav>
  );
}
