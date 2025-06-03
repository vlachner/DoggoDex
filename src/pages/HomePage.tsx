import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import BreedCard from "../components/BreedCard";
import CollectionList from "../components/CollectionList";
import CollectionTabs from "../components/CollectionTabs";
import { Dog } from "lucide-react";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { fetchBreedsAsync } from "../redux/slices/breedsSlice";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, error, searchQuery } = useAppSelector(
    (state) => state.breeds
  );
  const { activeCollection, owned, wishlist, readyToAdopt } = useAppSelector(
    (state) => state.collections
  );

  useEffect(() => {
    if (status === "idle" && !activeCollection) {
      // Fetch first page of breeds if no collection is active
      dispatch(fetchBreedsAsync(0));
    }
  }, [dispatch, status, activeCollection]);

  const renderContent = () => {
    // 1. Show loading state
    if (status === "loading") return <LoadingSpinner />;

    // 2. Show error state
    if (status === "failed")
      return <ErrorMessage message={error || "Failed to load breeds"} />;

    // 3. Show collection if active
    if (activeCollection) {
      const collectionItems = {
        owned,
        wishlist,
        readyToAdopt,
      }[activeCollection];

      return (
        <CollectionList
          collectionItems={collectionItems}
          collectionType={activeCollection}
        />
      );
    }

    // 4. Show "no results" state if no breeds found
    if (items.length === 0 && searchQuery) {
      return (
        <div className="text-center py-12">
          <Dog size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No results found
          </h3>
          <p className="text-gray-500">
            Try a different search term or browse all breeds.
          </p>
        </div>
      );
    }

    // 5. Show breed list and pagination
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((breed) => (
            <BreedCard key={breed.id} breed={breed} />
          ))}
        </div>
        <Pagination />
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-gray-700">
        <h1 className="text-3xl font-bold  mb-2">
          <img
            src="/doggo-32.png"
            alt="Dog Icon"
            className="inline-block w-9 h-9 mr-2"
          />
          DoggoDex
        </h1>
        <p className="mb-4">Explore and adopt different dog breeds.</p>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <CollectionTabs />
          {!activeCollection && <SearchBar />}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default HomePage;
