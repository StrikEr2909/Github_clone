import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import SearchBar from "../SearchBar";

describe("SearchBar test suite", () => {
  test("search bar should be rendered with search as label", () => {
    const { getAllByText } = render(<SearchBar />);

    getAllByText("Search");
  });

  test("search bar should be rendered with given label as label", () => {
    const label = "Xanpool hub";
    const { getAllByText } = render(<SearchBar label={label} />);

    getAllByText(label);
  });

  test("search bar should render loader when isLoading is true", () => {
    const { getByTestId } = render(<SearchBar isLoading />);

    getByTestId("search-bar-loader");
  });

  test("when user change input, onChange should be called", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<SearchBar isLoading onChange={onChange} />);

    const searchInputElement = getByTestId("search-input");

    fireEvent.change(searchInputElement, { target: { value: "abc" } });

    expect(onChange).toHaveBeenCalledWith("abc");
  });
});
