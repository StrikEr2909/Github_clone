import React, { useCallback, useMemo, useState } from "react";
import useQuery from "./useQuery";
import { StringAnyMap } from "../../types/common";
import { serializeUrlParams } from "../../utils/generalUtils";

import axios from "axios";

export const DEFAULT_PAGE_SIZE = 20;

const useFetchRepoListByUser = (params: {
  userId?: string;
  onSuccess?: (response: StringAnyMap) => void;
}) => {
  const userId = params?.userId;

  // initial payload
  const payload = useMemo(() => {
    return {
      page: 0,
      userId
    };
  }, [userId]);

  const fetchUserApi = useCallback((params) => {
    const page = params?.page || 0;
    const userId = params?.userId;

    return axios.get(
      `https://api.github.com/users/${userId}/repos?${serializeUrlParams({
        per_page: DEFAULT_PAGE_SIZE,
        page
      })}`
    );
  }, []);

  const responseAdapter = useCallback((response) => {
    return response?.data;
  }, []);

  const { loading, data, error, refetch, fetchMore } = useQuery({
    responseAdapter,
    payload,
    dataFetcher: fetchUserApi,
    onSuccess: params?.onSuccess
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
