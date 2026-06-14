"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useToast } from "@/components/ui/Toast";
import { useFavoritesStore } from "../store/favoritesStore";
import { favoritesService } from "../services/favoritesService";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  iconClassName?: string;
}

/**
 * Botón corazón reutilizable (cards del catálogo, PDP y página de favoritos).
 * El estado se deriva del store de favoritos; el alta/baja es optimista.
 */
export function FavoriteButton({
  productId,
  className = "",
  iconClassName = "w-4 h-4",
}: FavoriteButtonProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isFavorite = useFavoritesStore((s) => s.ids.includes(productId));
  const { showToast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    // Evita navegar cuando el botón vive dentro de un <Link> (cards).
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast("Iniciá sesión para guardar favoritos");
      return;
    }

    setIsPending(true);
    try {
      if (isFavorite) {
        await favoritesService.removeFavorite(productId);
      } else {
        await favoritesService.addFavorite(productId);
      }
    } catch {
      showToast("No se pudieron actualizar tus favoritos");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={isFavorite}
      className={`flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Heart
        className={`transition-colors ${
          isFavorite
            ? "fill-accent text-accent"
            : "text-white hover:text-accent"
        } ${iconClassName}`}
      />
    </button>
  );
}
