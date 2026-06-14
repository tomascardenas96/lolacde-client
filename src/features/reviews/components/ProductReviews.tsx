"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Star } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useToast } from "@/components/ui/Toast";
import { reviewsService } from "../services/reviewsService";
import { reviewSchema, type ReviewFormValues } from "../schemas/review-schema";
import type {
  Review,
  ReviewEligibility,
} from "../types/state.types";

const PAGE_SIZE = 5;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const authorName = (review: Review) => {
  if (!review.user) return "Cliente";
  return [review.user.name, review.user.lastname].filter(Boolean).join(" ");
};

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.round(value) ? "fill-accent text-accent" : "text-white/20"
          }`}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(null);

  const [selectedRating, setSelectedRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const setRating = (value: number) => {
    setSelectedRating(value);
    setValue("rating", value, { shouldValidate: true });
  };

  // Loaders sin setState síncrono: el estado se actualiza solo dentro de las
  // promesas, por lo que es seguro invocarlos desde efectos o handlers.
  const loadReviews = useCallback(
    (nextOffset: number, append: boolean) =>
      reviewsService
        .getReviews(productId, { limit: PAGE_SIZE, offset: nextOffset })
        .then((data) => {
          setTotal(data.total);
          setReviews((prev) =>
            append ? [...prev, ...data.reviews] : data.reviews,
          );
        })
        .catch(() => {
          // Mantener la UI funcional aunque falle la carga de reseñas.
        }),
    [productId],
  );

  const loadEligibility = useCallback(
    () =>
      reviewsService
        .getEligibility(productId)
        .then((data) => setEligibility(data))
        .catch(() => {}),
    [productId],
  );

  useEffect(() => {
    let active = true;
    loadReviews(0, false).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [loadReviews]);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadEligibility();
  }, [isAuthenticated, loadEligibility]);

  const handleLoadMore = () => {
    const next = offset + PAGE_SIZE;
    setOffset(next);
    setIsLoading(true);
    loadReviews(next, true).finally(() => setIsLoading(false));
  };

  const onSubmit = async (values: ReviewFormValues) => {
    try {
      await reviewsService.createReview(productId, {
        rating: values.rating,
        comment: values.comment?.trim() || undefined,
      });
      showToast("¡Gracias por tu reseña!");
      reset({ rating: 0, comment: "" });
      setSelectedRating(0);
      setOffset(0);
      await Promise.all([loadReviews(0, false), loadEligibility()]);
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "No se pudo enviar la reseña"
          : "No se pudo enviar la reseña";
      showToast(msg);
    }
  };

  const canShowForm = isAuthenticated && eligibility?.canReview;
  const showAlreadyReviewed = isAuthenticated && eligibility?.alreadyReviewed;

  return (
    <section className="px-6 md:px-20 lg:px-32 mt-24">
      <div className="border-t border-white/10 pt-16">
        <h2 className="heading-display text-3xl md:text-4xl text-white mb-10">
          RESEÑAS
          {total > 0 && (
            <span className="text-muted text-base ml-3">({total})</span>
          )}
        </h2>

        {/* Formulario — solo visible para clientes elegibles */}
        {canShowForm && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-16 max-w-xl bg-card p-8"
          >
            <p className="text-[0.7rem] tracking-[0.2em] text-white uppercase font-semibold mb-5">
              Dejá tu reseña
            </p>

            <div className="mb-5">
              <p className="text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-3">
                Puntuación
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`${value} estrellas`}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          value <= selectedRating
                            ? "fill-accent text-accent"
                            : "text-white/25 hover:text-white/50"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              {errors.rating && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-3">
                Comentario (opcional)
              </label>
              <textarea
                rows={4}
                {...register("comment")}
                placeholder="Contanos qué te pareció el producto..."
                className="w-full bg-transparent border border-white/10 p-4 text-sm text-white outline-none focus:border-white/40 transition-colors placeholder:text-muted/30 resize-none"
              />
              {errors.comment && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.comment.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black py-3 px-8 text-[0.65rem] tracking-[0.2em] uppercase font-semibold hover:bg-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Enviar reseña"}
            </button>
          </form>
        )}

        {showAlreadyReviewed && (
          <p className="mb-12 text-xs text-muted tracking-[0.1em] uppercase">
            Ya dejaste una reseña para este producto. ¡Gracias!
          </p>
        )}

        {/* Listado */}
        {isLoading && reviews.length === 0 ? (
          <p className="text-muted text-sm tracking-widest uppercase">
            Cargando reseñas...
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-muted text-sm tracking-widest uppercase">
            Todavía no hay reseñas para este producto.
          </p>
        ) : (
          <div className="space-y-8 max-w-2xl">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="border-b border-white/5 pb-8 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Stars value={review.rating} />
                    <span className="text-sm text-white">
                      {authorName(review)}
                    </span>
                    {review.isVerifiedPurchase && (
                      <span className="text-[0.5rem] tracking-[0.15em] uppercase text-accent border border-accent/30 px-2 py-0.5">
                        Compra verificada
                      </span>
                    )}
                  </div>
                  <span className="text-[0.6rem] text-muted">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted leading-relaxed mt-2">
                    {review.comment}
                  </p>
                )}
              </article>
            ))}

            {reviews.length < total && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="text-[0.65rem] tracking-[0.15em] uppercase border border-white/20 px-6 py-3 text-muted hover:border-white/50 hover:text-white transition-all cursor-pointer disabled:opacity-40"
              >
                {isLoading ? "Cargando..." : "Ver más reseñas"}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
