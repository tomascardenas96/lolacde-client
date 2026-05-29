// --- API response types ---

export interface ProductVariantAttributes {
  [key: string]: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: string;
  stock: number;
  attributes: ProductVariantAttributes | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  isMain: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  averageRating: string;
  totalReviews: number;
  category: ProductCategory;
  variants: ProductVariant[];
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

// --- Create product DTO ---

export interface CreateProductVariantDto {
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface CreateProductDto {
  name: string;
  description: string;
  categoryId: string;
  isActive?: boolean;
  variants: CreateProductVariantDto[];
}

export type CreateProductResponse = Product;

// --- Update product DTO ---

export interface UpdateProductDto {
  name?: string;
  description?: string;
  categoryId?: string;
  isActive?: boolean;
}

export type UpdateProductResponse = Product;

// --- Add variant DTO ---

export interface AddVariantDto {
  price: number;
  stock: number;
  attributes?: Record<string, string>;
}

export type AddVariantResponse = ProductVariant;

// --- Update variant DTO ---

export interface UpdateVariantDto {
  price?: number;
  stock?: number;
  attributes?: Record<string, string>;
}

export type UpdateVariantResponse = ProductVariant;

export interface ProductsResponse {
  total: number;
  products: Product[];
}

export interface GetProductsParams {
  limit?: number;
  offset?: number;
}

// --- Store state ---

export interface ProductsState {
  products: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;

  setProducts: (products: Product[], total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  removeProduct: (id: string) => void;
}
