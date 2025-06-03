import { ArrowLeft, Heart, Home, PawPrint } from "lucide-react";
import type { Breed, CollectionItem, CollectionType } from "../types";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  addToCollection,
  removeFromCollection,
} from "../redux/slices/collectionsSlice";
import { fetchBreedById, fetchBreedImage } from "../services/api";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

const BreedDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const collections = useAppSelector((state) => state.collections);

  const [breed, setBreed] = useState<Breed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBreedDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Breed ID is required");
        }

        const breedId = parseInt(id, 10);
        const breedData = await fetchBreedById(breedId);

        // Fetch breed image if needed
        if (breedData.reference_image_id) {
          try {
            const imageData = await fetchBreedImage(
              breedData.reference_image_id
            );
            breedData.image = imageData;
          } catch (imgError) {
            console.error("Failed to load breed image:", imgError);
          }
        }

        setBreed(breedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load breed details"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBreedDetails();
  }, [id]);

  const isInCollection = (collection: CollectionType) => {
    return collections[collection].some((item) => item.id === breed?.id);
  };

  const handleCollectionToggle = (collection: CollectionType) => {
    if (!breed) return;

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !breed) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorMessage message={error || "Breed not found"} />
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Breeds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Breeds
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 h-80 md:h-auto bg-gray-200">
            {breed.image?.url ? (
              <img
                src={breed.image.url}
                alt={breed.name}
                className="w-full h-full object-cover"
              />
            ) : breed.reference_image_id ? (
              <img
                src={`https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`}
                alt={breed.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {breed.name}
              </h1>
              <div className="flex space-x-2">
                {isInCollection("owned") && (
                  <button
                    className="p-2 rounded-full text-amber-500 bg-amber-50"
                    title="Owned"
                    disabled
                  >
                    <Home size={20} />
                  </button>
                )}
                <button
                  onClick={() => handleCollectionToggle("wishlist")}
                  className={`p-2 rounded-full transition-colors ${
                    isInCollection("wishlist")
                      ? "text-rose-500 bg-rose-50"
                      : "text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                  }`}
                  title="Wishlist"
                >
                  <Heart size={20} />
                </button>
                <button
                  onClick={() => handleCollectionToggle("readyToAdopt")}
                  className={`p-2 rounded-full transition-colors ${
                    isInCollection("readyToAdopt")
                      ? "text-emerald-500 bg-emerald-50"
                      : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-50"
                  }`}
                  title="Ready to Adopt"
                >
                  <PawPrint size={20} />
                </button>
              </div>
            </div>

            {breed.breed_group && (
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
                {breed.breed_group}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Life Span
                </h3>
                <p className="text-gray-900">{breed.life_span}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Origin
                </h3>
                <p className="text-gray-900">{breed.origin || "Unknown"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Weight
                </h3>
                <p className="text-gray-900">
                  {breed.weight.metric} kg / {breed.weight.imperial} lbs
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Height
                </h3>
                <p className="text-gray-900">
                  {breed.height.metric} cm / {breed.height.imperial} in
                </p>
              </div>
            </div>

            {breed.bred_for && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Bred For
                </h3>
                <p className="text-gray-900">{breed.bred_for}</p>
              </div>
            )}

            {breed.temperament && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Temperament
                </h3>
                <div className="flex flex-wrap gap-2">
                  {breed.temperament.split(", ").map((trait, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreedDetailPage;
