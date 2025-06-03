import type { CollectionItem, CollectionType } from "../types";

import { Link } from "react-router-dom";
import React from "react";
import { X } from "lucide-react";
import { removeFromCollection } from "../redux/slices/collectionsSlice";
import { useAppDispatch } from "../redux/hooks";

interface CollectionCardProps {
  item: CollectionItem;
  collectionType: CollectionType;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  item,
  collectionType,
}) => {
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(
      removeFromCollection({
        collection: collectionType,
        itemId: item.id,
      })
    );
  };

  const getCollectionColor = () => {
    switch (collectionType) {
      case "wishlist":
        return "border-rose-200 bg-rose-50";
      case "readyToAdopt":
        return "border-emerald-200 bg-emerald-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div
      className={`relative rounded-lg border-2 ${getCollectionColor()} overflow-hidden transition-transform duration-300 hover:shadow-md hover:scale-[1.02]`}
    >
      <Link to={`/breed/${item.id}`} className="block">
        <div className="h-40 bg-gray-200">
          {item.reference_image_id && (
            <img
              src={`https://cdn2.thedogapi.com/images/${item.reference_image_id}.jpg`}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>
        <div className="p-3">
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600">
            {item.breed_group || "Unknown Group"}
          </p>
        </div>
      </Link>
      {collectionType !== "owned" && (
        <button
          data-testid="remove-button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-600 hover:text-gray-900 transition-colors"
          title="Remove from collection"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default CollectionCard;
