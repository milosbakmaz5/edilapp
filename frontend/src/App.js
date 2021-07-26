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
import MainNavigation from "./shared/components/Navigation/MainNavigation/MainNavigation";
import AddItem from "./storage/pages/AddItem";
import Suppliers from "./suppliers/pages/Suppliers";
import UpdateItem from "./storage/pages/UpdateItem";
import { Suspense } from "react";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route exact path="/suppliers">
          <Suppliers />
        </Route>
        <Route exact path="/storage/new">
          <AddItem />
        </Route>
        <Route exact path="/storage/:id">
          <UpdateItem />
        </Route>
        <Route exact path="/storage">
          <Storage />
        </Route>
        <Redirect to="/suppliers" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Auth />
        </Route>
        <Route path="/:value" exact>
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
        {token && <MainNavigation />}
        <main>
          <Suspense>{routes}</Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
