export interface Breed {
  id: number;
  name: string;
  breed_group: string;
  temperament: string;
  life_span: string;
  bred_for: string;
  origin?: string;
  country_code?: string;
  reference_image_id: string;
  weight: {
    imperial: string;
    metric: string;
  };
  height: {
    imperial: string;
    metric: string;
  };
  image?: {
    id: string;
    url: string;
    width: number;
    height: number;
  };
}

export interface CollectionItem {
  id: number;
  name: string;
  reference_image_id: string;
  breed_group: string;
}

export type CollectionType = "wishlist" | "readyToAdopt" | "owned";

export interface BreedsState {
  items: Breed[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}
