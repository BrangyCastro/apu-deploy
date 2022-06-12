import React, { Suspense, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";

// routes config
import {
  _routesGeneral,
  _routesComun,
  _routesAdmin,
  _routesProve,
} from "src/main/router/router";
import useAuth from "src/presentation/hooks/useAuth";
import { Error404 } from "src/presentation/pages/error404/Error404";

const loading = (
  <div id="preloader">
    <div id="loader"></div>
  </div>
);

const TheContent = () => {
  const user = useAuth();

  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    setRoutes((searches) => searches.concat(_routesComun));
    if (user.user.roles.find((item) => item.role === "GENERAL")) {
      setRoutes((searches) => searches.concat(_routesGeneral));
    }
    if (user.user.roles.find((item) => item.role === "PROVE")) {
      setRoutes((searches) => searches.concat(_routesProve));
    }
    if (user.user.roles.find((item) => item.role === "ADMIN")) {
      setRoutes((searches) => searches.concat(_routesAdmin));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => (
                      <CFade>
                        <route.component {...props} />
                      </CFade>
                    )}
                  />
                )
              );
            })}
            <Route
              exact
              path="*"
              name="404"
              render={() => {
                return <Error404 />;
              }}
            />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default React.memo(TheContent);
