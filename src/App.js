import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import SignIn from "./components/SignIn/SignIn";
import Menu from "./components/Menu/Menu";
import Dashboard from "./components/Dashboard/Dashboard";
import ExamForm from "./components/ExamForm/ExamForm";

const App = () => {
  let uri = window.location.href;
  uri = uri.slice(uri.lastIndexOf("/") + 1);

  return (
    <Router>
      {uri !== "exam" ? <Menu /> : null}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/exam">
          <ExamForm />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
