import { Heart, Home, PawPrint } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import type { CollectionType } from "../types";
import React from "react";
import { setActiveCollection } from "../redux/slices/collectionsSlice";

const CollectionTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeCollection, wishlist, readyToAdopt, owned } = useAppSelector(
    (state) => state.collections
  );

  const handleTabClick = (collection: CollectionType | null) => {
    dispatch(setActiveCollection(collection));
  };

  return (
    <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 mb-6">
      <button
        onClick={() => handleTabClick(null)}
        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
          activeCollection === null
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All Breeds
      </button>

      <button
        onClick={() => handleTabClick("wishlist")}
        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
          activeCollection === "wishlist"
            ? "bg-rose-500 text-white"
            : "bg-rose-50 text-rose-700 hover:bg-rose-100"
        }`}
      >
        <Heart size={16} className="mr-2" />
        Wish List ({wishlist.length})
      </button>

      <button
        onClick={() => handleTabClick("readyToAdopt")}
        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
          activeCollection === "readyToAdopt"
            ? "bg-emerald-500 text-white"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        <PawPrint size={16} className="mr-2" />
        Ready to Adopt ({readyToAdopt.length})
      </button>

      <button
        onClick={() => handleTabClick("owned")}
        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
          activeCollection === "owned"
            ? "bg-amber-500 text-white"
            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
        }`}
      >
        <Home size={16} className="mr-2" />
        Owned ({owned.length})
      </button>
    </div>
  );
};

export default CollectionTabs;
