import collectionsReducer, {
  addToCollection,
  adoptBreeds,
  removeFromCollection,
  setActiveCollection,
} from "../../redux/slices/collectionsSlice";

import type { CollectionItem } from "../../types";

const sampleItem: CollectionItem = {
  id: 1,
  name: "Akita",
  breed_group: "Working",
  reference_image_id: "abc123",
};

describe("collectionsSlice", () => {
  it("should return the initial state", () => {
    const initialState = collectionsReducer(undefined, { type: "" });
    expect(initialState).toEqual({
      owned: [],
      wishlist: [],
      readyToAdopt: [],
      activeCollection: null,
    });
  });

  describe("addToCollection", () => {
    it("should add a new item to the specified collection", () => {
      const state = collectionsReducer(
        undefined,
        addToCollection({ collection: "wishlist", item: sampleItem })
      );
      expect(state.wishlist).toContainEqual(sampleItem);
    });

    it("should not duplicate items in a collection", () => {
      const preloadedState = {
        owned: [],
        wishlist: [sampleItem],
        readyToAdopt: [],
        activeCollection: null,
      };

      const state = collectionsReducer(
        preloadedState,
        addToCollection({ collection: "wishlist", item: sampleItem })
      );
      expect(state.wishlist.length).toBe(1);
    });
  });

  describe("removeFromCollection", () => {
    it("should remove an item from the specified collection", () => {
      const preloadedState = {
        owned: [],
        wishlist: [sampleItem],
        readyToAdopt: [],
        activeCollection: null,
      };

      const state = collectionsReducer(
        preloadedState,
        removeFromCollection({ collection: "wishlist", itemId: sampleItem.id })
      );

      expect(state.wishlist).toEqual([]);
    });
  });

  it("should handle setActiveCollection", () => {
    const state = collectionsReducer(
      undefined,
      setActiveCollection("wishlist")
    );
    expect(state.activeCollection).toBe("wishlist");
  });

  describe("adoptBreeds", () => {
    it("should move all items from readyToAdopt to owned", () => {
      const initialState = {
        owned: [],
        wishlist: [],
        readyToAdopt: [sampleItem],
        activeCollection: null,
      };
      const nextState = collectionsReducer(initialState, adoptBreeds());
      expect(nextState.owned).toEqual([sampleItem]);
    });

    it("should clear the readyToAdopt array", () => {
      const initialState = {
        owned: [],
        wishlist: [],
        readyToAdopt: [sampleItem],
        activeCollection: null,
      };
      const nextState = collectionsReducer(initialState, adoptBreeds());
      expect(nextState.readyToAdopt).toEqual([]);
    });
  });
});
