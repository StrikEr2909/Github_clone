import _ from "lodash";

import { StringAnyMap } from "../types/common";

const TRUE = true;

export const serializeUrlParams = function (
  urlParams: StringAnyMap,
  encode = TRUE
) {
  return _.compact(
    _.map(urlParams, (v, k) => {
      return v != null ? `${k}=${encode ? encodeURIComponent(v) : v}` : "";
    })
  ).join("&");
};
