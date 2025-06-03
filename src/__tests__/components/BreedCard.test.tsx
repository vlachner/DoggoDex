import * as collectionSlice from "../../redux/slices/collectionsSlice";
import * as reduxHooks from "../../redux/hooks";

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import type { Breed } from "../../types";
import BreedCard from "../../components/BreedCard";
import { BrowserRouter } from "react-router-dom";

const mockBreed: Breed = {
  weight: {
    imperial: "65 - 115",
    metric: "29 - 52",
  },
  height: {
    imperial: "24 - 28",
    metric: "61 - 71",
  },
  id: 6,
  name: "Akita",
  bred_for: "Hunting bears",
  breed_group: "Working",
  life_span: "10 - 14 years",
  temperament:
    "Docile, Alert, Responsive, Dignified, Composed, Friendly, Receptive, Faithful, Courageous",
  reference_image_id: "BFRYBufpm",
};

describe("BreedCard", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(mockDispatch);
    vi.spyOn(reduxHooks, "useAppSelector").mockReturnValue({
      wishlist: [],
      readyToAdopt: [],
      owned: [],
    });
  });

  it("renders breed info correctly", () => {
    render(
      <BrowserRouter>
        <BreedCard breed={mockBreed} />
      </BrowserRouter>
    );

    expect(screen.getByText("Akita")).toBeInTheDocument();
    expect(screen.getByTestId("breed-group")).toHaveTextContent(
      "Group: Working"
    );
    expect(screen.getByTestId("breed-life-span")).toHaveTextContent(
      "Life Span: 10 - 14 years"
    );
    expect(screen.getByTestId("breed-temperament")).toHaveTextContent(
      "Temperament: Docile, Alert, Responsive, Dignified, Composed, Friendly, Receptive, Faithful, Courageous"
    );
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.src).toContain("BFRYBufpm.jpg");
  });

  it("dispatches addToCollection for wishlist on click", () => {
    render(
      <BrowserRouter>
        <BreedCard breed={mockBreed} />
      </BrowserRouter>
    );

    const addToCollectionSpy = vi.spyOn(collectionSlice, "addToCollection");
    const heartButton = screen.getByTitle("Wishlist");
    fireEvent.click(heartButton);

    expect(addToCollectionSpy).toHaveBeenCalledWith({
      collection: "wishlist",
      item: expect.objectContaining({
        id: 6,
        name: "Akita",
        reference_image_id: "BFRYBufpm",
        breed_group: "Working",
      }),
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("dispatches removeFromCollection on click when already in collection", () => {
    vi.spyOn(reduxHooks, "useAppSelector").mockReturnValue({
      wishlist: [mockBreed],
      readyToAdopt: [],
      owned: [],
    });

    const removeFromCollectionSpy = vi.spyOn(
      collectionSlice,
      "removeFromCollection"
    );

    render(
      <BrowserRouter>
        <BreedCard breed={mockBreed} />
      </BrowserRouter>
    );

    const heartButton = screen.getByTestId("wishlist-button");
    fireEvent.click(heartButton);

    expect(removeFromCollectionSpy).toHaveBeenCalledWith({
      collection: "wishlist",
      itemId: 6,
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("dispatches addToCollection for wishlist on click", () => {
    render(
      <BrowserRouter>
        <BreedCard breed={mockBreed} />
      </BrowserRouter>
    );

    const addToCollectionSpy = vi.spyOn(collectionSlice, "addToCollection");
    const pawPrintButton = screen.getByTestId("ready-to-adopt-button");
    fireEvent.click(pawPrintButton);

    expect(addToCollectionSpy).toHaveBeenCalledWith({
      collection: "readyToAdopt",
      item: expect.objectContaining({
        id: 6,
        name: "Akita",
        reference_image_id: "BFRYBufpm",
        breed_group: "Working",
      }),
    });
    expect(mockDispatch).toHaveBeenCalled();
  });
});
