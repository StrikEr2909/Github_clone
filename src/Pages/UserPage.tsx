//libs
import React, { lazy, Suspense, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";

//components
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

const RepoListByUser = lazy(() => import("../Components/RepoListByUser"));

interface UserPageProps {}

const UserPage = (props: UserPageProps) => {
  const { userId } = useParams<{ userId?: string }>();
  const history = useHistory();

  const redirectToHome = useCallback(() => {
    history.push(`/home`);
  }, [history]);

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
      </div>
      <div className="flex justify-self-center m-10 text-4xl">
        {`Xanpool Hub Profile for ${userId}`}
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col items-center w-full">
            <CircularProgress />
          </div>
        }
      >
        <RepoListByUser userId={userId} />
      </Suspense>
    </div>
  );
};

export default UserPage;
