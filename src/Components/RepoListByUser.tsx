import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";
import _ from "lodash";

import SearchBar from "../Components/SearchBar";
import { useHistory } from "react-router-dom";

import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Snackbar from "@mui/material/Snackbar";
import SnippetFolderIcon from "@mui/icons-material/SnippetFolder";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import useFetchRepoListByUser, {
  DEFAULT_PAGE_SIZE
} from "./hooks/useFetchRepoListByUser";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SCROLL_CONTAINER_HEIGHT = 300;

interface RepoListByUserProps {
  userId?: string;
}

const RepoListByUser: React.FC<RepoListByUserProps> = (props) => {
  const { userId } = props;
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLElement>(null);
  const history = useHistory();

  const onSuccess = useCallback((response) => {
    if (response?.data?.length < DEFAULT_PAGE_SIZE) {
      setHasMore(false);
    }
  }, []);

  const { loading, data, error, refetch, fetchMore } = useFetchRepoListByUser({
    userId,
    onSuccess
  });

  const fetchingMore = loading && data;

  const onChange = useCallback((updatedKeyword) => {
    setKeyword(updatedKeyword);
  }, []);

  const onScroll = useCallback(
    (e) => {
      _.defer(() => {
        const page = data?.length / DEFAULT_PAGE_SIZE;
        const pageInteger = _.toInteger(page);

        if (!fetchingMore && hasMore) {
          const { scrollHeight, scrollTop } = scrollContainerRef.current;

          /* 1.25 depicts that after subtracting the height of container, when 25%
         of container height is left then start fetching more */
          if (scrollTop > scrollHeight - 1.25 * SCROLL_CONTAINER_HEIGHT) {
            fetchMore({
              keyword,
              userId,
              page: pageInteger
            });
          }
        }
      });
    },
    [fetchMore, fetchingMore, userId, keyword, data, hasMore]
  );

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onMenuItemClick = useCallback(
    (e) => {
      if (e?.target?.getAttribute) {
        const repoName = e.target.getAttribute("data-id");

        history.push(`/repository/${userId}/${repoName}`);
      }
    },
    [history, userId]
  );

  //this wont work properly, github API doesnt support keyword
  const filteredData = useMemo(() => {
    return _.filter(data, (repoObj) => {
      return _.includes(
        (repoObj?.name || "").toLowerCase(),
        (keyword || "").toLowerCase()
      );
    });
  }, [data, keyword]);

  return (
    <div className="px-20 w-full">
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error?.message ||
            `There was some errors while fething repository for ${userId}!`}
        </Alert>
      </Snackbar>
      <SearchBar
        isLoading={loading}
        onDefferedChange={onChange}
        label="Search Xanpoll Hub Repositories"
      />
      <MenuList>
        <div
          id="scrollableDiv"
          ref={scrollContainerRef}
          style={{
            height: SCROLL_CONTAINER_HEIGHT,
            overflow: "auto",
            display: "flex",
            flexDirection: "column"
          }}
          onScroll={onScroll}
        >
          {_.map(filteredData, (repoObj) => {
            const name = repoObj?.name;

            return (
              <MenuItem key={repoObj?.id}>
                <div data-id={name} onClick={onMenuItemClick}>
                  <SnippetFolderIcon fontSize="small" className="mr-1" />
                  {name}
                </div>
              </MenuItem>
            );
          })}
        </div>
        {fetchingMore ? <LinearProgress /> : null}
      </MenuList>
    </div>
  );
};

export default RepoListByUser;
