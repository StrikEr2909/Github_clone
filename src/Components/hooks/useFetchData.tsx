import _ from "lodash";
import { useState, useEffect, useCallback, useRef } from "react";
import useMountedState from "react-use/lib/useMountedState";

import { StringAnyMap } from "../../types/common";

function cancelReq(reqPromiseRef: StringAnyMap, currentReqIdRef: StringAnyMap) {
  if (reqPromiseRef.current && reqPromiseRef.current.cancel) {
    reqPromiseRef.current.cancel();
  }
  reqPromiseRef.current = null;
  currentReqIdRef.current = null;
}

function isStale(
  reqId: string,
  currentReqIdRef: StringAnyMap,
  isMounted: () => boolean
) {
  return reqId !== currentReqIdRef.current || !isMounted();
}

export default function useFetchData({
  responseAdapter = _.identity,
  dataFetcher,
  onSuccess = _.noop,
  onError = _.noop,
  initialLoading = true,
  cancelOnUnmount = true
}: {
  responseAdapter?: (response: StringAnyMap) => StringAnyMap;
  onSuccess?: (response?: StringAnyMap, args?: StringAnyMap) => void;
  onError?: (error?: StringAnyMap) => void;
  cancelOnUnmount?: boolean;
  initialLoading?: boolean;
  dataFetcher: (payload?: StringAnyMap) => Promise<any>;
}) {
  const [loading, setLoading] = useState(initialLoading);
  const [dataAndReqParams, setDataAndRequestParams] = useState({
    data: undefined,
    requestParams: undefined
  });
  const [error, setError] = useState(undefined);
  const ongoingReqRef = useRef(null);
  const currentReqIdRef = useRef(null);
  const cancelOnUnmountRef = useRef(cancelOnUnmount);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onSuccess);
  const responseAdapterRef = useRef(responseAdapter);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;
  responseAdapterRef.current = responseAdapter;
  const isMounted = useMountedState();

  const cancel = useCallback(() => {
    cancelReq(ongoingReqRef, currentReqIdRef);
  }, []);

  useEffect(
    () => () => {
      if (cancelOnUnmountRef.current) {
        cancelReq(ongoingReqRef, currentReqIdRef);
      }
    },
    []
  );

  const fetchData = useCallback(
    (...args) => {
      setLoading(true);
      setDataAndRequestParams({ data: undefined, requestParams: undefined });
      setError(undefined);
      const reqId = _.uniqueId("reqId");
      currentReqIdRef.current = reqId;
      ongoingReqRef.current = dataFetcher(...args);

      ongoingReqRef.current
        .then(
          (response) => {
            onSuccessRef.current(response, args);
            if (isStale(reqId, currentReqIdRef, isMounted)) {
              return undefined;
            }
            setDataAndRequestParams({
              data: responseAdapterRef.current(response),
              requestParams: args
            });
            setError(undefined);
            return response;
          },
          (e) => {
            onErrorRef.current(e);
            if (isStale(reqId, currentReqIdRef, isMounted)) {
              return;
            }
            setError(e);
            setDataAndRequestParams({ data: undefined, requestParams: args });
          }
        )
        .finally(() => {
          if (isStale(reqId, currentReqIdRef, isMounted)) {
            return;
          }
          setLoading(false);
        });

      return {
        promise: ongoingReqRef.current,
        cancel: () => cancelReq(ongoingReqRef, currentReqIdRef)
      };
    },
    [setDataAndRequestParams, dataFetcher, isMounted]
  );

  return {
    loading,
    data: dataAndReqParams.data,
    error,
    fetchData,
    cancel,
    requestParams: dataAndReqParams.requestParams
  };
}
