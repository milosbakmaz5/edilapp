import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";

import Auth from "./users/pages/Auth/Auth";

const App = () => {
  const routes = (
    <Switch>
      <Route path="/">
        <Auth />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
  return (
    <div>
      <Router>{routes}</Router>
    </div>
  );
};

export default App;
