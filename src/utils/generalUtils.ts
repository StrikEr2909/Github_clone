import _ from "lodash";

const TRUE = true;

export const serializeUrlParams = function (urlParams, encode = TRUE) {
  return _.compact(
    _.map(urlParams, (v, k) => {
      return v != null ? `${k}=${encode ? encodeURIComponent(v) : v}` : "";
    })
  ).join("&");
};
