import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import RepoListByUser from "../RepoListByUser";

jest.mock("axios");

describe("RepoListByUser test suite", () => {
  test("search bar should be rendered for repolist component", () => {
    const { getAllByText } = render(<RepoListByUser />);

    getAllByText("Search Xanpoll Hub Repositories");
  });

  test("search bar should be rendered for repolist component", () => {
    const userId = "testUserId";
    const { getAllByText } = render(<RepoListByUser userId={userId} />);

    const axios = require("axios");

    expect(axios.get).toHaveBeenCalledWith("");
  });
});
