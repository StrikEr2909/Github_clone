import React, { useState, useCallback, useMemo } from "react";
import _ from "lodash";

import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

interface SearchBarProps {
  label?: string;
  isLoading?: boolean;
  onChange?: (keyword: string) => void;
  onDefferedChange?: (keyword: string) => void;
}

const INPUT_PROPS = {
  inputProps: {
    "data-testid": "search-input"
  },
  endAdornment: (
    <CircularProgress
      size={20}
      data-testid="search-bar-loader"
    ></CircularProgress>
  )
};

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const isLoading = props?.isLoading;
  const onChange = props?.onChange;
  const onDefferedChange = props?.onDefferedChange;

  const _onDefferedChange = useMemo(() => {
    if (onDefferedChange) {
      return _.debounce(onDefferedChange, 300);
    }
    return null;
  }, [onDefferedChange]);

  const _onChange = useCallback(
    (event) => {
      if (onChange) {
        onChange(event?.target?.value);
      }
      if (_onDefferedChange) {
        _onDefferedChange(event?.target?.value);
      }
    },
    [onChange, _onDefferedChange]
  );

  return (
    <TextField
      id="outlined-basic"
      label={props?.label || "Search"}
      variant="outlined"
      onChange={_onChange}
      InputProps={isLoading ? INPUT_PROPS : undefined}
      className="w-full"
    />
  );
};

export default SearchBar;
