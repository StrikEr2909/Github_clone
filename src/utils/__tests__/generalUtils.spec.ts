import { serializeUrlParams } from "../generalUtils";

describe("general utils test suite", () => {
  describe("serializeUrlParams test suite", () => {
    test("when encode is false, empty url params should return empty string", () => {
      expect(serializeUrlParams({}, false)).toBe("");
    });

    test("when encode is false, url params with undefined or null should return empty string", () => {
      expect(
        serializeUrlParams(
          {
            keyword: undefined,
            size: null
          },
          false
        )
      ).toBe("");
    });

    test("when encode is false, url params with 0 or false should return correct string", () => {
      expect(
        serializeUrlParams(
          {
            keyword: "abc",
            size: 10
          },
          false
        )
      ).toBe("keyword=abc&size=10");
    });

    test("when encode is flase, url params should return correct string without encoding", () => {
      expect(
        serializeUrlParams(
          {
            keyword: "ABC abc 123",
            size: 10
          },
          false
        )
      ).toBe("keyword=ABC abc 123&size=10");
    });

    test("when encode is not defined, empty url params should return empty string", () => {
      expect(serializeUrlParams({})).toBe("");
    });

    test("when encode is true, empty url params should return empty string", () => {
      expect(serializeUrlParams({}, true)).toBe("");
    });

    test("when encode is true, url params with undefined or null should return empty string", () => {
      expect(
        serializeUrlParams(
          {
            keyword: undefined,
            size: null
          },
          true
        )
      ).toBe("");
    });

    test("when encode is true, url params with 0 or false should return correct string", () => {
      expect(
        serializeUrlParams(
          {
            keyword: "abc",
            size: 10
          },
          true
        )
      ).toBe("keyword=abc&size=10");
    });

    test("when encode is true, url params should return correct encoded string", () => {
      expect(
        serializeUrlParams(
          {
            keyword: "ABC abc 123",
            size: 10
          },
          true
        )
      ).toBe("keyword=ABC%20abc%20123&size=10");
    });
  });
});
