import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { AxiosError } from "axios";
import { useProductsStore } from "../store/productsStore";
import {
  AddVariantDto,
  AddVariantResponse,
  CreateProductDto,
  CreateProductResponse,
  GetProductsParams,
  Product,
  ProductImage,
  ProductsResponse,
  UpdateProductDto,
  UpdateProductResponse,
  UpdateVariantDto,
  UpdateVariantResponse,
} from "../types/state.types";

export const productsService = {
  getProducts: async (params: GetProductsParams = {}): Promise<void> => {
    const { setProducts, setLoading, setError } = useProductsStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.get<ProductsResponse>("/products", {
        params,
      });
      const products = data.products ?? [];
      setProducts(products, data.total ?? products.length);
      logger.info(
        "PRODUCTS_SERVICE",
        `${products.length} productos cargados (total: ${data.total ?? products.length})`,
      );
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "Error al obtener los productos"
          : "Error al obtener los productos";
      setError(msg);
      logger.error("PRODUCTS_SERVICE", msg, error);
    } finally {
      setLoading(false);
    }
  },

  createProduct: async (
    payload: CreateProductDto,
  ): Promise<CreateProductResponse> => {
    const { data } = await apiClient.post<CreateProductResponse>(
      "/products",
      payload,
    );
    logger.info("PRODUCTS_SERVICE", `Producto creado: ${data.id}`);
    return data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    logger.info("PRODUCTS_SERVICE", `Producto obtenido: ${id}`);
    return data;
  },

  updateProduct: async (
    id: string,
    payload: UpdateProductDto,
  ): Promise<UpdateProductResponse> => {
    const { data } = await apiClient.patch<UpdateProductResponse>(
      `/products/${id}`,
      payload,
    );
    logger.info("PRODUCTS_SERVICE", `Producto actualizado: ${id}`);
    return data;
  },

  addVariant: async (
    productId: string,
    payload: AddVariantDto,
  ): Promise<AddVariantResponse> => {
    const { data } = await apiClient.post<AddVariantResponse>(
      `/products/${productId}/variants`,
      payload,
    );
    logger.info("PRODUCTS_SERVICE", `Variante agregada a producto ${productId}`);
    return data;
  },

  updateVariant: async (
    productId: string,
    variantId: string,
    payload: UpdateVariantDto,
  ): Promise<UpdateVariantResponse> => {
    const { data } = await apiClient.patch<UpdateVariantResponse>(
      `/products/${productId}/variants/${variantId}`,
      payload,
    );
    logger.info(
      "PRODUCTS_SERVICE",
      `Variante ${variantId} actualizada (producto ${productId})`,
    );
    return data;
  },

  deleteVariant: async (
    productId: string,
    variantId: string,
  ): Promise<void> => {
    await apiClient.delete(`/products/${productId}/variants/${variantId}`);
    logger.info(
      "PRODUCTS_SERVICE",
      `Variante ${variantId} eliminada (producto ${productId})`,
    );
  },

  deleteProduct: async (id: string): Promise<void> => {
    const { removeProduct, setError } = useProductsStore.getState();
    try {
      await apiClient.delete(`/products/${id}`);
      removeProduct(id);
      logger.info("PRODUCTS_SERVICE", `Producto eliminado: ${id}`);
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "Error al eliminar el producto"
          : "Error al eliminar el producto";
      setError(msg);
      logger.error("PRODUCTS_SERVICE", msg, error);
      throw error;
    }
  },

  uploadProductImages: async (
    productId: string,
    files: File[],
    onProgress?: (percent: number) => void,
  ): Promise<ProductImage[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const { data } = await apiClient.post<ProductImage[]>(
      `/products/${productId}/images/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!onProgress || !evt.total) return;
          onProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      },
    );
    logger.info(
      "PRODUCTS_SERVICE",
      `${data.length} imágenes subidas para producto ${productId}`,
    );
    return data;
  },
};
