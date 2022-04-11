/* eslint-disable complexity */
import React from "react";
import { Route } from "react-router-dom";
import { routes } from "@constants";
import Login from "@components/login/login";
import ErrorBoundary from "../errorBoundary";
import offlineStyle from "../offlineWrapper/offlineWrapper.css";

// eslint-disable-next-line max-statements
const CustomRoute = ({ path, exact, isPrivate, component, t, history }) => {
  const isNetworkSet = true;

  return (
    <main
      className={`${isPrivate ? offlineStyle.disableWhenOffline : ""
        } offlineWrapper`}
    >
      <ErrorBoundary
        errorMessage={t("An error occurred while rendering this page")}
      >
        <Route
          path={isNetworkSet ? path : routes.login.path}
          exact={exact}
          key={isNetworkSet ? path : routes.login.path}
          component={isNetworkSet ? component : Login}
        />
      </ErrorBoundary>
    </main>
  );
};

CustomRoute.defaultProps = {
  t: (str) => str,
  pathSuffix: "",
  pathPrefix: "",
};

export default CustomRoute;
