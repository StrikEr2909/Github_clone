//libs
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

//components
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  const [userName, setUserName] = useState("");

  const history = useHistory();

  const onChange = useCallback((e) => {
    setUserName(e?.target?.value);
  }, []);

  const onButtonClick = useCallback(() => {
    history.push(`/user/${userName}`);
  }, [userName, history]);

  return (
    <div className="grid justify-items-stretch">
      <div className="flex justify-self-center m-10 text-4xl">
        Welcome to Xanpool Hub
      </div>
      <div className="flex w-full px-20">
        <TextField
          id="outlined-basic"
          label="Enter Github User"
          variant="outlined"
          onChange={onChange}
          className="w-full"
        />
        <div className="flex ml-4">
          <Button
            variant="contained"
            endIcon={<PersonSearchIcon />}
            onClick={onButtonClick}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
