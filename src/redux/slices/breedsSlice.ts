import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { fetchBreeds, searchBreeds } from "../../services/api";

import type { BreedsState } from "../../types";

const initialState: BreedsState = {
  items: [],
  status: "idle",
  error: null,
  currentPage: 0,
  totalPages: 0,
  searchQuery: "",
};

export const fetchBreedsAsync = createAsyncThunk(
  "breeds/fetchBreeds",
  async (page: number) => {
    const response = await fetchBreeds(page);
    return { breeds: response, page };
  }
);

export const searchBreedsAsync = createAsyncThunk(
  "breeds/searchBreeds",
  async (query: string) => {
    if (!query.trim()) {
      const response = await fetchBreeds(0);
      return { breeds: response, query };
    }
    const response = await searchBreeds(query);
    return { breeds: response, query };
  }
);

const breedsSlice = createSlice({
  name: "breeds",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreedsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.breeds;
        state.currentPage = action.payload.page;
        // Workaround for total pages since API does not provide it
        state.totalPages = Math.ceil(172 / 12);
      })
      .addCase(searchBreedsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.breeds;
        state.searchQuery = action.payload.query;
        state.currentPage = 0;
        // Search API does not support pagination
        state.totalPages = state.searchQuery ? 1 : Math.ceil(172 / 12);
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state) => {
          state.status = "failed";
          state.error = "Failed to load data";
        }
      );
  },
});

export const { setCurrentPage, clearSearch } = breedsSlice.actions;
export default breedsSlice.reducer;
