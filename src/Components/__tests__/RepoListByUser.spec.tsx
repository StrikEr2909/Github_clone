import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import RepoListByUser from "../RepoListByUser";

jest.mock("axios", () => {
  return {
    get: jest.fn(),
  };
});

const mockAxios = (resolvedValue?: any, rejectValue?: any) => {
  const axios = require("axios");

  const axiosGet = axios.get;

  if (rejectValue) {
    axiosGet.mockRejectedValue(rejectValue);
    return axios;
  }

  axiosGet.mockResolvedValue(
    resolvedValue || {
      data: [
        {
          name: "repo 1",
          id: 1,
        },
        {
          name: "repo 2",
          id: 2,
        },
      ],
    }
  );

  return axios;
};

describe("RepoListByUser test suite", () => {
  test("search bar should be rendered", () => {
    mockAxios();
    const { getAllByText } = render(<RepoListByUser />);

    getAllByText("Search Xanpoll Hub Repositories");
  });

  test("loading should be rendered initially", () => {
    mockAxios();

    const { getByTestId } = render(<RepoListByUser />);
    getByTestId("search-bar-loader");
  });

  test("call should be made with correct arguments", () => {
    const userId = "testUserId";
    mockAxios();

    const axios = require("axios");

    const { getAllByText } = render(<RepoListByUser userId={userId} />);

    expect(axios.get).toHaveBeenCalledWith(
      "https://api.github.com/users/testUserId/repos?per_page=20&page=0"
    );
  });

  test("returned repo-list should be rendered when call is success-full", async () => {
    const userId = "testUserId";

    const axios = mockAxios();

    const { findByText } = render(<RepoListByUser userId={userId} />);

    await findByText("repo 1");
    await findByText("repo 2");
  });

  test("error should be rendered when call is failed", async () => {
    const userId = "testUserId";
    const message = "error message";
    const axios = mockAxios(null, { message });

    const { findByText } = render(<RepoListByUser userId={userId} />);

    await findByText(message);
  });
});
