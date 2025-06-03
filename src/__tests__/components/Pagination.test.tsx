import * as breedsSlice from "../../redux/slices/breedsSlice";
import * as reduxHooks from "../../redux/hooks";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import Pagination from "../../components/Pagination";

describe("Pagination", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(mockDispatch);
  });

  const setup = ({
    currentPage,
    totalPages,
  }: {
    currentPage: number;
    totalPages: number;
  }) => {
    vi.spyOn(reduxHooks, "useAppSelector").mockReturnValue({
      currentPage,
      totalPages,
    });
    render(<Pagination />);
  };

  it("should render null if totalPages is 1 or less", () => {
    setup({ currentPage: 0, totalPages: 1 });
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("should render correct number of page buttons based on totalPages and currentPage", () => {
    setup({ currentPage: 3, totalPages: 10 });
    // 5 page buttons max visible includes previous, next buttons
    expect(screen.getAllByRole("button").length).toBe(7);
  });

  it("should disable previous button on first page", () => {
    setup({ currentPage: 0, totalPages: 5 });
    const prevBtn = screen.getByTestId("page-button-prev");
    expect(prevBtn).toBeDisabled();
  });

  it("should disable next button on last page", () => {
    setup({ currentPage: 4, totalPages: 5 });
    const nextBtn = screen.getByTestId("page-button-next");
    expect(nextBtn).toBeDisabled();
  });

  it("should dispatch setCurrentPage and fetchBreedsAsync on page button click", () => {
    setup({ currentPage: 2, totalPages: 5 });

    const setCurrentPageSpy = vi.spyOn(breedsSlice, "setCurrentPage");
    const fetchBreedsAsyncSpy = vi.spyOn(breedsSlice, "fetchBreedsAsync");

    const pageButton = screen.getByText("4");
    fireEvent.click(pageButton);

    expect(setCurrentPageSpy).toHaveBeenCalledWith(3);
    expect(fetchBreedsAsyncSpy).toHaveBeenCalledWith(3);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });
});
