interface CollectionListProps {
  collectionItems: CollectionItem[];
  collectionType: CollectionType;
}

import type { CollectionItem, CollectionType } from "../types";
import React, { useState } from "react";

import CollectionCard from "./CollectionCard";
import { Dog } from "lucide-react";
import { adoptBreeds } from "../redux/slices/collectionsSlice";
import { useAppDispatch } from "../redux/hooks";

const CollectionList: React.FC<CollectionListProps> = ({
  collectionItems,
  collectionType,
}) => {
  const dispatch = useAppDispatch();
  const [showAdoptDialog, setShowAdoptDialog] = useState(false);

  const handleAdopt = () => {
    dispatch(adoptBreeds());
    setShowAdoptDialog(false);
  };

  // If no items in collection, show empty state
  if (collectionItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Dog size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          No dogs in this collection yet
        </h3>
        <p className="text-gray-500">
          <span>Browse the breeds and add some to your </span>
          <span>{collectionType}</span>
          <span> collection</span>
        </p>
      </div>
    );
  }

  return (
    <>
      {collectionType === "readyToAdopt" && collectionItems.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowAdoptDialog(true)}
            className="w-full md:w-auto px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Adopt Now ({collectionItems.length} breeds)
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {collectionItems.map((item) => (
          <CollectionCard
            key={item.id}
            item={item}
            collectionType={collectionType}
          />
        ))}
      </div>

      {showAdoptDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Adoption</h2>
            <div className="text-gray-600 mb-6">
              <p>
                You are about to adopt {collectionItems.length} dogs. It's a big
                commitment!
              </p>
              <p className="mt-2 font-semibold">
                Are you sure you want to proceed?
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAdoptDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAdopt}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
              >
                I'm Sure, Adopt!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CollectionList;
