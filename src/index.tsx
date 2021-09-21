import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

import Home from "./Pages/Home";
import RepositoryPage from "./Pages/RepositoryPage";
import UserPage from "./Pages/UserPage";

import "tailwindcss/tailwind.css";

const App: React.FC = () => {
  return (
    <Router>
      <Route
        render={({ location }) => (
          <>
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Switch location={location}>
              <Route component={Home} exact path="/home" />
              <Route component={UserPage} exact path="/user/:userId" />
              <Route
                component={RepositoryPage}
                exact
                path="/repository/:userId/:repoName"
              />
              <Route render={() => <div>Page Not Found</div>} />
            </Switch>
          </>
        )}
      />
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
