/**
 * User: Ishan Changela
 * Date: 21/09/21
 * Time: 6:24 PM
 */

import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import FileListByRepo from "../FileListByRepo";

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
          name: "file 1",
          id: 1,
        },
        {
          name: "file 2",
          id: 2,
        },
      ],
    }
  );

  return axios;
};

describe("FileListByRepo test suite", () => {
  test("search bar should be rendered", () => {
    mockAxios();
    const { getAllByText } = render(<FileListByRepo />);

    getAllByText("Search Xanpoll Hub Files");
  });

  test("loading should be rendered initially", () => {
    mockAxios();

    const { getByTestId } = render(<FileListByRepo />);
    getByTestId("search-bar-loader");
  });

  test("call should be made with correct arguments", () => {
    const userId = "testUserId";
    const repoName = "testReponame";

    mockAxios();

    const axios = require("axios");

    const { getAllByText } = render(
      <FileListByRepo userId={userId} repoName={repoName} />
    );

    expect(axios.get).toHaveBeenCalledWith(
      "https://api.github.com/repos/testUserId/testReponame/contents/"
    );
  });

  test("returned file-list should be rendered when call is success-full", async () => {
    const userId = "testUserId";

    const axios = mockAxios();

    const { findByText } = render(<FileListByRepo userId={userId} />);

    await findByText("file 1");
    await findByText("file 2");
  });

  test("only file icon should be rendered when response contains only files", async () => {
    const userId = "testUserId";

    const axios = mockAxios();

    const { findAllByTestId } = render(<FileListByRepo userId={userId} />);

    await findAllByTestId("file-icon");
  });

  test("only folder icon should be rendered when response contains only folders", async () => {
    const userId = "testUserId";

    const axios = mockAxios({
      data: [
        {
          type: "dir",
          name: "file 1",
          id: 1,
        },
        {
          type: "dir",
          name: "file 2",
          id: 2,
        },
      ],
    });

    const { findAllByTestId } = render(<FileListByRepo userId={userId} />);

    await findAllByTestId("folder-icon");
  });

  test("error should be rendered when call is failed", async () => {
    const userId = "testUserId";
    const message = "error message";
    const axios = mockAxios(null, { message });

    const { findByText } = render(<FileListByRepo userId={userId} />);

    await findByText(message);
  });
});
