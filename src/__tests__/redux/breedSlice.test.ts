import type { Breed, BreedsState } from "../../types";
import breedsReducer, {
  clearSearch,
  fetchBreedsAsync,
  searchBreedsAsync,
  setCurrentPage,
} from "../../redux/slices/breedsSlice";

const sampleBreeds: Breed[] = [
  {
    id: 1,
    name: "Akita",
    bred_for: "Hunting bears",
    breed_group: "Working",
    life_span: "10 - 14 years",
    temperament: "Docile, Alert",
    reference_image_id: "abc123",
    weight: { imperial: "65 - 115", metric: "29 - 52" },
    height: { imperial: "24 - 28", metric: "61 - 71" },
  },
];

describe("breedsSlice", () => {
  const initialState: BreedsState = {
    items: [],
    status: "idle",
    error: null,
    currentPage: 0,
    totalPages: 0,
    searchQuery: "",
  };

  it("should return the initial state", () => {
    expect(breedsReducer(undefined, { type: "" })).toEqual(initialState);
  });

  describe("reducers", () => {
    it("should handle setCurrentPage", () => {
      const state = breedsReducer(initialState, setCurrentPage(3));
      expect(state.currentPage).toBe(3);
    });

    it("should handle clearSearch", () => {
      const stateWithSearch = { ...initialState, searchQuery: "akita" };
      const state = breedsReducer(stateWithSearch, clearSearch());
      expect(state.searchQuery).toBe("");
    });
  });

  describe("extraReducers - fetchBreedsAsync", () => {
    it("should handle fetchBreedsAsync.pending", () => {
      const action = { type: fetchBreedsAsync.pending.type };
      const state = breedsReducer(initialState, action);
      expect(state.status).toBe("loading");
      expect(state.error).toBeNull();
    });

    it("should handle fetchBreedsAsync.fulfilled", () => {
      const action = {
        type: fetchBreedsAsync.fulfilled.type,
        payload: { breeds: sampleBreeds, page: 1 },
      };
      const state = breedsReducer(initialState, action);
      expect(state.status).toBe("succeeded");
      expect(state.items).toEqual(sampleBreeds);
      expect(state.currentPage).toBe(1);
      expect(state.totalPages).toBe(15);
    });

    it("should handle fetchBreedsAsync.rejected", () => {
      const action = { type: fetchBreedsAsync.rejected.type };
      const state = breedsReducer(initialState, action);
      expect(state.status).toBe("failed");
      expect(state.error).toBe("Failed to load data");
    });
  });

  describe("extraReducers - searchBreedsAsync", () => {
    it("should handle searchBreedsAsync.pending", () => {
      const action = { type: searchBreedsAsync.pending.type };
      const state = breedsReducer(initialState, action);
      expect(state.status).toBe("loading");
      expect(state.error).toBeNull();
    });

    it("should handle searchBreedsAsync.fulfilled with query", () => {
      const action = {
        type: searchBreedsAsync.fulfilled.type,
        payload: { breeds: sampleBreeds, query: "akita" },
      };
      const state = breedsReducer(initialState, action);
      expect(state.status).toBe("succeeded");
      expect(state.items).toEqual(sampleBreeds);
      expect(state.searchQuery).toBe("akita");
      expect(state.currentPage).toBe(0);
      expect(state.totalPages).toBe(1); // Because search disables pagination
    });

    it("should handle searchBreedsAsync.fulfilled with empty query", () => {
      const action = {
        type: searchBreedsAsync.fulfilled.type,
        payload: { breeds: sampleBreeds, query: "" },
      };
      const state = breedsReducer({ ...initialState, totalPages: 5 }, action);
      expect(state.status).toBe("succeeded");
      expect(state.items).toEqual(sampleBreeds);
      expect(state.searchQuery).toBe("");
      expect(state.currentPage).toBe(0);
      expect(state.totalPages).toBe(15);
    });

    it("should handle searchBreedsAsync.rejected", () => {
      const action = { type: searchBreedsAsync.rejected.type };
      const state = breedsReducer(initialState, action);
      expect(state.status).toBe("failed");
      expect(state.error).toBe("Failed to load data");
    });
  });
});
