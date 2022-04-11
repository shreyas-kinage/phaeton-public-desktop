import React from "react";
import { Switch } from "react-router-dom";
import { hot } from "react-hot-loader/root";
import "./variables.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomRoute from "@subcomponents/customRoute";
import { routes } from "@constants";
import ThemeContext from "../contexts/theme";
import styles from "./app.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();
const App = ({ history }) => {
  const theme = "dark";

  const routesList = Object.keys(routes);

  return (
    <ThemeContext.Provider value={theme}>
      <Switch>
        {routesList.map((route) => (
          <CustomRoute
            key={routes[route].path}
            route={routes[route]}
            path={routes[route].path}
            exact={routes[route].exact}
            isPrivate={routes[route].isPrivate}
            forbiddenTokens={routes[route].forbiddenTokens}
            component={routes[route].component}
            history={history}
          />
        ))}
      </Switch>
    </ThemeContext.Provider>
  );
};

export default App;
export const DevApp = hot(App);
