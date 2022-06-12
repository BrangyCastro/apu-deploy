import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { TheLayout } from "src/presentation/containers";
import Login from "src/presentation/pages/login/Login";

export const Routing = ({ setRefreshCheckLogin, user }) => {
  if (!user) {
    return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <Login setRefreshCheckLogin={setRefreshCheckLogin} />
          </Route>
          {/* <Route path="/auth/forgotPassword" exact component={ChangePassword} /> */}
          <Route
            exact
            path="*"
            render={() => {
              return <Redirect to="/" />;
            }}
          />
        </Switch>
      </Router>
    );
  }

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          name="Home"
          render={(props) => (
            <TheLayout {...props} setRefreshCheckLogin={setRefreshCheckLogin} />
          )}
        />
      </Switch>
    </Router>
  );
};
// export default Routing;
