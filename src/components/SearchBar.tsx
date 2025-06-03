import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { Search } from "lucide-react";
import { searchBreedsAsync } from "../redux/slices/breedsSlice";

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentQuery = useAppSelector((state) => state.breeds.searchQuery);
  const [query, setQuery] = useState(currentQuery);

  // Handle input change with debounce
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery !== currentQuery) {
      dispatch(searchBreedsAsync(debouncedQuery));
    }
  }, [debouncedQuery, dispatch, currentQuery]);

  return (
    <div className="relative w-full lg:max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        placeholder="Search for a dog breed..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
