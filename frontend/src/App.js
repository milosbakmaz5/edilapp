import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import { useAuth } from "./shared/hooks/auth-hook";

import Auth from "./users/pages/Auth/Auth";
import Storage from "./storage/pages/Storage";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/storage">
          <Storage />
        </Route>
        <Redirect to="/storage" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/">
          <Auth />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId: userId,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
