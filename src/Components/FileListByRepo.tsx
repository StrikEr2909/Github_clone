//libs
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import _ from "lodash";

//components
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Snackbar from "@mui/material/Snackbar";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import SearchBar from "../Components/SearchBar";

//hooks
import useFetchRepoData from "./hooks/useFetchRepoData";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SCROLL_CONTAINER_HEIGHT = 300;

interface FileListByRepoProps {
  userId?: string;
  repoName?: string;
}

const FileListByRepo: React.FC<FileListByRepoProps> = (props) => {
  const { userId, repoName } = props;
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);

  const { loading, data, error } = useFetchRepoData({
    userId,
    repoName,
  });

  const onChange = useCallback((updatedKeyword) => {
    setKeyword(updatedKeyword);
  }, []);

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
            `There was some errors while fething Files for ${repoName}!`}
        </Alert>
      </Snackbar>
      <SearchBar
        isLoading={loading}
        onDefferedChange={onChange}
        label="Search Xanpoll Hub Files"
      />
      <MenuList>
        <div
          id="scrollableDiv"
          style={{
            height: SCROLL_CONTAINER_HEIGHT,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {_.map(filteredData, (fileObj) => {
            const name = fileObj?.name;
            const type = fileObj?.type;
            const isDirectory = type === "dir";

            return (
              <MenuItem key={fileObj?.git_url}>
                <div data-id={name} key={fileObj?.git_url} className="w-full">
                  {isDirectory ? (
                    <FolderIcon
                      fontSize="small"
                      className="mr-1"
                      data-testid="folder-icon"
                    />
                  ) : (
                    <DescriptionIcon
                      fontSize="small"
                      className="mr-1"
                      data-testid="file-icon"
                    />
                  )}
                  {name}
                </div>
              </MenuItem>
            );
          })}
        </div>
      </MenuList>
    </div>
  );
};

export default FileListByRepo;
