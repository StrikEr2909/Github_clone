import { useCallback, useEffect, useRef, useMemo } from "react";
import useFetchData from "./useFetchData";
import { StringAnyMap } from "../../types/common";

function defaultMergeData(
  prevData: Array<StringAnyMap>,
  nextData: Array<StringAnyMap>
) {
  return [...prevData, ...nextData];
}

export default function useQuery({
  payload: initialPayload,
  responseAdapter,
  skip,
  onSuccess,
  onError,
  cancelOnUnmount,
  mergeData = defaultMergeData,
  dataFetcher
}: {
  payload?: StringAnyMap;
  responseAdapter?: (
    response: StringAnyMap,
    args?: StringAnyMap
  ) => StringAnyMap;
  skip?: boolean;
  onSuccess?: (response: StringAnyMap) => void;
  onError?: (error: StringAnyMap) => void;
  cancelOnUnmount?: boolean;
  mergeData?: (
    prevData: Array<StringAnyMap>,
    nextData: Array<StringAnyMap>
  ) => StringAnyMap;
  dataFetcher?: (payload?: StringAnyMap) => Promise<any>;
}) {
  const skipRef = useRef(skip);
  skipRef.current = skip;
  const initialPayloadRef = useRef(initialPayload);
  initialPayloadRef.current = initialPayload;
  const prevDataRef = useRef(null);

  useEffect(() => {
    prevDataRef.current = null;
  }, [dataFetcher]);

  const {
    loading,
    data,
    error,
    fetchData,
    cancel,
    requestParams: params
  } = useFetchData({
    initialLoading: !skip,
    dataFetcher,
    responseAdapter,
    onSuccess,
    onError,
    cancelOnUnmount
  });

  const refetch = useCallback(
    (_payload = initialPayload) => {
      prevDataRef.current = null;
      cancel();
      fetchData(_payload);
    },
    [initialPayload, cancel, fetchData]
  );

  const combinedData = useMemo(() => {
    if (prevDataRef.current && data) {
      return mergeData(prevDataRef.current, data);
    }

    //while fetching more data for next page or infinite scroll, data will be undefined
    return data || (prevDataRef.current ? prevDataRef.current : data);
  }, [data, mergeData]);

  const combinedDataRef = useRef(combinedData);
  combinedDataRef.current = combinedData;

  const fetchMore = useCallback(
    (_payload) => {
      prevDataRef.current = combinedDataRef.current;
      cancel();
      return fetchData(_payload).promise;
    },
    [fetchData, cancel]
  );

  useEffect(() => {
    if (skipRef.current) {
      return undefined;
    }
    const { cancel: cancelReq } = fetchData(initialPayloadRef.current);
    return cancelOnUnmount ? cancelReq : undefined;
  }, [cancelOnUnmount, fetchData]);

  return {
    loading,
    data: combinedData,
    error,
    refetch,
    fetchMore,
    requestParams: params ? params[0] : undefined
  };
}
