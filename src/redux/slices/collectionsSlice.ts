import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CollectionItem, CollectionType } from "../../types";

interface CollectionsState {
  owned: CollectionItem[];
  wishlist: CollectionItem[];
  readyToAdopt: CollectionItem[];
  activeCollection: CollectionType | null;
}

const initialState: CollectionsState = {
  owned: [],
  wishlist: [],
  readyToAdopt: [],
  activeCollection: null,
};

const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    addToCollection: (
      state,
      action: PayloadAction<{
        collection: CollectionType;
        item: CollectionItem;
      }>
    ) => {
      const { collection, item } = action.payload;
      if (
        !state[collection].some((existingItem) => existingItem.id === item.id)
      ) {
        state[collection].push(item);
      }
    },
    removeFromCollection: (
      state,
      action: PayloadAction<{ collection: CollectionType; itemId: number }>
    ) => {
      const { collection, itemId } = action.payload;
      state[collection] = state[collection].filter(
        (item) => item.id !== itemId
      );
    },
    setActiveCollection: (
      state,
      action: PayloadAction<CollectionType | null>
    ) => {
      state.activeCollection = action.payload;
    },
    adoptBreeds: (state) => {
      // Move all breeds from readyToAdopt to owned
      state.owned = [...state.owned, ...state.readyToAdopt];
      state.readyToAdopt = [];
    },
  },
});

export const {
  addToCollection,
  removeFromCollection,
  setActiveCollection,
  adoptBreeds,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
