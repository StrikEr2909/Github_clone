//libs
import React, { useCallback, lazy, Suspense } from "react";
import { useParams, useHistory } from "react-router-dom";

//components
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

interface RepositoryPageProps {}

const FileListByRepo = lazy(() => import("../Components/FileListByRepo"));
const ReadMeComponent = lazy(() => import("../Components/ReadMeComponent"));

const RepositoryPage = (props: RepositoryPageProps) => {
  const { userId, repoName } = useParams<{
    userId?: string;
    repoName?: string;
  }>();
  const history = useHistory();

  const redirectToHome = useCallback(() => {
    history.push(`/home`);
  }, [history]);

  const redirectToUser = useCallback(() => {
    history.push(`/user/${userId}`);
  }, [history, userId]);

  return (
    <div className="grid justify-items-stretch">
      <div className="mt-1 ml-1">
        <IconButton
          aria-label="home"
          size="large"
          onClick={redirectToHome}
          className="items-center"
        >
          <HomeIcon fontSize="small" className="fill-current text-black" />
        </IconButton>
        <IconButton
          aria-label="back"
          size="large"
          onClick={redirectToUser}
          className="items-center ml-1"
        >
          <ArrowBackIcon fontSize="small" className="fill-current text-black" />
        </IconButton>
      </div>
      <div className="flex justify-self-center m-10 text-2xl">
        {`Xanpool Hub Repository ${repoName} for ${userId}`}
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col items-center w-full">
            <CircularProgress />
          </div>
        }
      >
        <FileListByRepo userId={userId} repoName={repoName} />
        <ReadMeComponent userId={userId} repoName={repoName} />
      </Suspense>
    </div>
  );
};

export default RepositoryPage;
