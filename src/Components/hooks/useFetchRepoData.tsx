//libs
import { useCallback, useMemo } from "react";
import axios from "axios";

//hooks
import useQuery from "./useQuery";

const EMPTY_STRING = "";

const useFetchRepoListByUser = (params: {
  userId?: string;
  repoName?: string;
  filePath?: string; //empty for fetching all files
}) => {
  const userId = params?.userId;
  const repoName = params?.repoName;
  const filePath = params?.filePath;

  const payload = useMemo(() => {
    return {
      repoName,
      userId,
      filePath
    };
  }, [repoName, filePath, userId]);

  const fetchUserApi = useCallback((params) => {
    const userId = params?.userId || EMPTY_STRING;
    const repoName = params?.repoName || EMPTY_STRING;
    const filePath = params?.filePath || EMPTY_STRING;

    return axios.get(
      `https://api.github.com/repos/${userId}/${repoName}/contents/${filePath}`
    );
  }, []);

  const responseAdapter = useCallback((response) => {
    return response?.data;
  }, []);

  const { loading, data, error, refetch, fetchMore } = useQuery({
    responseAdapter,
    payload,
    dataFetcher: fetchUserApi,
  });

  return {
    loading,
    data,
    error,
    refetch,
    fetchMore
  };
};

export default useFetchRepoListByUser;
