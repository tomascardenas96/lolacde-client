import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { useCategoriesStore } from "../store/categoriesStore";
import { Category, CreateCategoryDto, UpdateCategoryDto } from "../types/state.types";

interface CategoriesResponse {
  categories?: Category[];
  total?: number;
}

export const categoriesService = {
  // Usado por los forms de productos (sin store, devuelve array directamente)
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[] | CategoriesResponse>(
      "/categories",
    );
    const list = Array.isArray(data) ? data : data.categories ?? [];
    logger.info("CATEGORIES_SERVICE", `${list.length} categorías cargadas`);
    return list;
  },

  // Carga el store (para la página de gestión de categorías)
  loadCategories: async (): Promise<void> => {
    const { setCategories, setLoading, setError } =
      useCategoriesStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.get<Category[]>("/categories");
      const list = Array.isArray(data) ? data : [];
      setCategories(list);
      logger.info(
        "CATEGORIES_SERVICE",
        `${list.length} categorías cargadas en store`,
      );
    } catch (error: unknown) {
      const msg = getApiErrorMessage(
        error,
        "No se pudieron cargar las categorías",
      );
      setError(msg);
      logger.error("CATEGORIES_SERVICE", msg, error);
    } finally {
      setLoading(false);
    }
  },

  createCategory: async (dto: CreateCategoryDto): Promise<Category> => {
    const { data } = await apiClient.post<Category>("/categories", dto);
    logger.info("CATEGORIES_SERVICE", `Categoría creada: ${data.id}`);
    return data;
  },

  updateCategory: async (
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<Category> => {
    const { data } = await apiClient.patch<Category>(`/categories/${id}`, dto);
    logger.info("CATEGORIES_SERVICE", `Categoría actualizada: ${id}`);
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    const { removeCategory } = useCategoriesStore.getState();
    try {
      await apiClient.delete(`/categories/${id}`);
      removeCategory(id);
      logger.info("CATEGORIES_SERVICE", `Categoría eliminada: ${id}`);
    } catch (error: unknown) {
      logger.error(
        "CATEGORIES_SERVICE",
        getApiErrorMessage(error, "No se pudo eliminar la categoría"),
        error,
      );
      throw error;
    }
  },
};
