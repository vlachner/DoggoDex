import * as collectionSlice from "../../redux/slices/collectionsSlice";
import * as reduxHooks from "../../redux/hooks";

import type { CollectionItem, CollectionType } from "../../types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { BrowserRouter } from "react-router-dom";
import CollectionCard from "../../components/CollectionCard";

const mockItem: CollectionItem = {
  id: 6,
  name: "Akita",
  reference_image_id: "BFRYBufpm",
  breed_group: "Working",
};

describe("CollectionCard", () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(dispatchMock);
  });

  const renderComponent = (collectionType: CollectionType) =>
    render(
      <BrowserRouter>
        <CollectionCard item={mockItem} collectionType={collectionType} />
      </BrowserRouter>
    );

  it("should render breed name and group", () => {
    renderComponent("wishlist");

    expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    expect(screen.getByText(mockItem.breed_group)).toBeInTheDocument();
  });

  it("should render image with correct src and alt", () => {
    renderComponent("wishlist");

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(mockItem.reference_image_id);
    expect(img.alt).toBe(mockItem.name);
  });

  it("should hide image on error", () => {
    renderComponent("wishlist");
    const img = screen.getByRole("img") as HTMLImageElement;
    fireEvent.error(img);
    expect(img.style.display).toBe("none");
  });

  it("should display remove button when collectionType is not 'wishlist'", () => {
    renderComponent("wishlist");
    expect(screen.queryByTestId("remove-button")).toBeInTheDocument();
  });

  it("should display remove button when collectionType is 'readyToAdopt'", () => {
    renderComponent("readyToAdopt");
    expect(screen.queryByTestId("remove-button")).toBeInTheDocument();
  });

  it("should hide remove button when collectionType is 'owned'", () => {
    renderComponent("owned");
    expect(screen.queryByTestId("remove-button")).toBeNull();
  });

  it("dispatches removeFromCollection with correct payload on remove button click", () => {
    renderComponent("wishlist");

    const removeBtn = screen.getByTestId("remove-button");
    fireEvent.click(removeBtn);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(
      collectionSlice.removeFromCollection({
        collection: "wishlist",
        itemId: mockItem.id,
      })
    );
  });
});
