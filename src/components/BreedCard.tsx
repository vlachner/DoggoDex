import type { Breed, CollectionItem, CollectionType } from "../types";
import { Heart, PawPrint } from "lucide-react";
import {
  addToCollection,
  removeFromCollection,
} from "../redux/slices/collectionsSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { Link } from "react-router-dom";
import React from "react";

interface BreedCardProps {
  breed: Breed;
}

const BreedCard: React.FC<BreedCardProps> = ({ breed }) => {
  const dispatch = useAppDispatch();
  const collections = useAppSelector((state) => state.collections);

  const isInCollection = (collection: CollectionType) => {
    return collections[collection].some((item) => item.id === breed.id);
  };

  const handleCollectionToggle = (collection: CollectionType) => {
    const collectionItem: CollectionItem = {
      id: breed.id,
      name: breed.name,
      reference_image_id: breed.reference_image_id,
      breed_group: breed.breed_group || "Unknown",
    };

    if (isInCollection(collection)) {
      dispatch(removeFromCollection({ collection, itemId: breed.id }));
    } else {
      dispatch(addToCollection({ collection, item: collectionItem }));
    }
  };

  return (
    <div className="hover-shake bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
      <Link to={`/breed/${breed.id}`} className="block">
        <div className="h-48 bg-gray-200">
          {breed.reference_image_id && (
            <img
              src={`https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`}
              alt={breed.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {breed.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1" data-testid="breed-group">
            <span className="font-medium">Group: </span>
            {breed.breed_group || "Unknown"}
          </p>
          <p
            className="text-sm text-gray-600 mb-1"
            data-testid="breed-life-span"
          >
            <span className="font-medium">Life Span:</span> {breed.life_span}
          </p>
          <p
            className="text-sm text-gray-600 line-clamp-2"
            data-testid="breed-temperament"
          >
            <span className="font-medium">Temperament: </span>
            {breed.temperament || "Unknown"}
          </p>
        </div>
      </Link>
      <div className="flex justify-between p-4 pt-0 border-t border-gray-100">
        <button
          onClick={() => handleCollectionToggle("wishlist")}
          className={`p-2 rounded-full transition-colors ${
            isInCollection("wishlist")
              ? "text-rose-500 bg-rose-50"
              : "text-gray-400 hover:text-rose-500 hover:bg-rose-50"
          }`}
          title="Wishlist"
          data-testid="wishlist-button"
        >
          <Heart size={18} />
        </button>
        <button
          onClick={() => handleCollectionToggle("readyToAdopt")}
          className={`p-2 rounded-full transition-colors ${
            isInCollection("readyToAdopt")
              ? "text-emerald-500 bg-emerald-50"
              : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-50"
          }`}
          title="Ready to Adopt"
          data-testid="ready-to-adopt-button"
        >
          <PawPrint size={18} />
        </button>
      </div>
    </div>
  );
};

export default BreedCard;
