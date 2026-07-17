export interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: { id: string; name: string } | null;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  parentId?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  parentId?: string;
}

export interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  setCategories: (categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  removeCategory: (id: string) => void;
}
