import React, { useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import RepoListByUser from "../Components/RepoListByUser";

const UserPage = (props) => {
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
      <RepoListByUser userId={userId} />
    </div>
  );
};

export default UserPage;
