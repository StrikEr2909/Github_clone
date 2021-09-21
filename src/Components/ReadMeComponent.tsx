//libs
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";

//components
import Snackbar from "@mui/material/Snackbar";
import ReactMarkdown from "react-markdown";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
//hooks
import useFetchRepoData from "./hooks/useFetchRepoData";

//types
import { StringAnyMap } from "../types/common";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface FileListByRepoProps {
  userId?: string;
  repoName?: string;
}

const ReadMeComponent: React.FC<FileListByRepoProps> = (props) => {
  const { userId, repoName } = props;
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const { loading, data, error } = useFetchRepoData({
    userId,
    repoName,
    filePath: "README.md",
  });

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

  return (
    <>
      <div className="px-20 w-full">
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error?.message ||
              `There was some errors while fething readme for ${repoName}!`}
          </Alert>
        </Snackbar>
        <div className="mt-4">
          <div className="text-2xl">README.md</div>
          <div className="flex mt-2 flex-col">
            {loading ? (
              <CircularProgress data-testid="read-me-loader" />
            ) : (
              //@ts-ignore
              <ReactMarkdown>{atob(data?.content || "")}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadMeComponent;
