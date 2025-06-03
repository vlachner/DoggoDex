import type { Breed } from "../types";
import axios from "axios";

const API_KEY = import.meta.env.VITE_DOGGO_API_KEY;
const BASE_URL = import.meta.env.VITE_DOGGO_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-api-key": API_KEY,
  },
});

export const fetchBreeds = async (page = 0, limit = 12) => {
  const response = await api.get<Breed[]>("/breeds", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const searchBreeds = async (query: string, limit = 12) => {
  const response = await api.get<Breed[]>("/breeds/search", {
    params: {
      q: query,
    },
  });
  // Search API does not support pagination, so we limit the results manually
  return response.data.slice(0, limit);
};

export const fetchBreedById = async (id: number) => {
  const response = await api.get<Breed>(`/breeds/${id}`);
  return response.data;
};

export const fetchBreedImage = async (imageId: string) => {
  const response = await api.get(`/images/${imageId}`);
  return response.data;
};

export default api;
